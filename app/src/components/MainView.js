import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";

import { Scatterplot } from "./subcomponents/scatterplot";
import { scatterplotStyle } from './subcomponents/styles';
import { barChart } from './subcomponents/barChart';
import { CaptureViewManage } from './subcomponents/captureViewManage'
import  "../css/mainview.css"
import { getLatentEmb, reconstruction, getKnn, latentCoorToOthers, reload } from '../helpers/server';
import { useParams } from "react-router-dom";
// import { deepcopyArr } from '../helpers/utils';
import ScrollBar from './subcomponents/ScrollBar';
import { Paper, Box, Grid } from '@mui/material';



const MainView = (props) => {
  let params = useParams();
  
  const pointNum = parseInt(params.pointNum);
  const dataset = params.dataset;
  const idx = parseInt(params.idx)
  let labelData = require(`../json/${dataset}-${pointNum.toString()}-label.json`);
      if (typeof labelData === 'object' && labelData !== null){
        labelData = Object.values(labelData)
      }
  
  let labelColors = d3.scaleOrdinal(d3.schemeCategory10);
  let embCategoryColors = d3.scaleOrdinal(d3.schemeDark2);

  embCategoryColors(0);
  embCategoryColors(1);
  embCategoryColors(2);
  embCategoryColors(3);


  // CONSTANTs for managing layout / design
  
  const { radius, size, margin, methods, url, info } = props;
  

  const paneSize = size * 0.6;

  
  const mainViewRef = useRef(null);
  const latentViewRef = useRef(null);
  const simEmbSvgRef = useRef(null);
  const captureViewRef = useRef(null);
  

  let mainViewSplot, latentViewSplot;

  // CONSTANT datas (latent values / current embedding)
  let emb;
  let latentValues = [0, 0, 0, 0, 0];
  
  let latentcoor;

  const colorData = labelData.map(idx => {
		const color = d3.rgb(labelColors(idx));
		return [color.r, color.g, color.b];
	});

  let latentColorData;

  // CONSTANTs for components
  let simEmbBarChart;  
  let captureViewManage;

  let latentEmb, latentLabel;
  
  // NOTE Initial Embedding construction
  useEffect(() => {

    (async() => {
      await reload(url, dataset, pointNum).then(async dims => {
        await reconstruction(url, latentValues).then(async res => {
          emb = res;
  
          const data = {
            position: emb,
            opacity: new Array(emb.length).fill(1),
            color: colorData,
            border: new Array(emb.length).fill(0),
            borderColor: colorData,
            radius: new Array(emb.length).fill(radius),
          }
          mainViewSplot = new Scatterplot(data, mainViewRef.current);
          
          const latentEmbData = await getLatentEmb(url);
          const latentKnnData = await getKnn(url, latentValues);
      
          latentEmb = latentEmbData.emb;
          latentLabel = latentEmbData.label;
      
          latentColorData = latentLabel.map(idx => {
            const color = d3.rgb(embCategoryColors(idx));
            return [color.r, color.g, color.b];
          });
      
          [[0, 0, 0]].concat(latentColorData)
      
          latentcoor = latentKnnData.coor;
          
          const latentData = {
            position: [latentKnnData.coor].concat(latentEmb),
            opacity: new Array(latentEmb.length + 1).fill(1),
            color: [[255, 255, 255]].concat(latentColorData),
            border:[50].concat(new Array(latentEmb.length).fill(0)),
            borderColor: [[0, 0, 0]].concat(latentColorData),
            radius: [radius * 8].concat(new Array(latentEmb.length).fill(radius * 0.5)),
          }
      
      
          latentViewSplot = new Scatterplot(latentData, latentViewRef.current);
          
          simEmbBarChart = new barChart(
            simEmbSvgRef, 
            size * 0.35, 
            size * 0.56, 
            margin,
            methods
          );
      
          const labelNums = latentKnnData.labels.reduce((acc, curr) => {
            acc[curr] += 1;
            return acc;
          }, [0, 0, 0, 0, 0])
          simEmbBarChart.initialize(labelNums);
  
        })
      })
  
    })();
  }, [params]);
  
  // NOTE for capture view
  useEffect(() => {
    captureViewManage = new CaptureViewManage(captureViewRef, pointNum, colorData);
  });

  function captureCurrentEmbedding(e) {
    const currCaptureNum = captureViewManage.currentCaptureNum();
    if (currCaptureNum === 3) {
      alert("Cannot add more captures!! Erase to add new capture.");
      return;
    }
    else { 
      captureViewManage.addCapture(latentValues, emb); 
    }
  }

  function removeCurrentCapture(e) {
    const index = e.target.id.slice(13);
    captureViewManage.removeCapture(parseInt(index))
  }

  function restoreCurrentCapture(e) {
    const index = e.target.id.slice(13);
    const [currlatentValues, embedding] = captureViewManage.returnInfo(index);
    mainViewSplot.update({ position: embedding }, 1000, 0);
    currlatentValues.forEach((val, i) => {
      document.getElementById("latent" + i).value = val * 10;
    });
    (async () => {
      const latentKnnData = await getKnn(url, currlatentValues);
      // console.log(latentKnnData)

      latentcoor = latentKnnData.coor;
      const labels = latentKnnData.labels;

      const labelNums = labels.reduce((acc, curr) => {
        acc[curr] += 1;
        return acc;
      }, [0, 0, 0, 0, 0])
      simEmbBarChart.update(labelNums, 1000);

      const latentData = {
        position: [latentcoor].concat(latentEmb)
      }

      latentViewSplot.update(latentData, 1000, 0);

    })();
  }

  function mouseoverCapture(e) { e.target.style.border = "2px solid black"; }

  function mouseoutCapture(e) { e.target.style.border = "1px solid black";}
  // NOTE about latent variables
  
  function updateLatentValue(e) {
    const latentIdx = parseInt(e.target.id.slice(6));  // get the current latent value attribute number
    latentValues[latentIdx] = e.target.value / 10;

    (async () => {
      emb = await reconstruction(url, latentValues);
      const data = {
        position: emb
      }
      mainViewSplot.update(data, 50, 0);
    })();

    (async () => {
      const data = await getKnn(url, latentValues);
      latentcoor = data.coor;
      const labels = data.labels;
      const labelNums = labels.reduce((acc, curr) => {
        acc[curr] += 1;
        return acc;
      }, [0, 0, 0, 0, 0])
      
      simEmbBarChart.update(labelNums, 10);
      const latentData = {
        position: [latentcoor].concat(latentEmb)
      }

      latentViewSplot.update(latentData, 10, 0)

    })();
  }


  // NOTE adjusting current location in latent embeddings

  let draggingLatentPos = false;
  // let dragStartPosition;
  let dragCurrentPosition;
  let draggingInterval;

  useEffect(() => {
    // console.log('add dragging')      
    latentViewRef.current.addEventListener('mousedown',(e) => {
      console.log('addDragging')
      const xCoor = 2 * (e.offsetX / paneSize) - 1;
      const yCoor = 2 * ((paneSize - e.offsetY) / paneSize) - 1;
      
      const dist2LatentCoor = Math.sqrt((xCoor - latentcoor[0]) * (xCoor - latentcoor[0]) 
                                      + (yCoor - latentcoor[1]) * (yCoor - latentcoor[1]));  
       console.log(xCoor, yCoor, e.offsetX, e.offsetY, dist2LatentCoor)
      const distThreshold = radius * 8 / (size * 10);           
      if (distThreshold > dist2LatentCoor) {
        draggingLatentPos = true;
        // console.log()
        // dragStartPosition = [xCoor, yCoor];
        dragCurrentPosition = [xCoor, yCoor];
        draggingInterval = setInterval(() => {
          const latentData = {
            position: [dragCurrentPosition].concat(latentEmb)
          };
          latentViewSplot.update(latentData, 50, 0);
          (async () => {
            let data = await latentCoorToOthers(url, dragCurrentPosition);

            // update bar chart
            const labelNums = data.labels.reduce((acc, curr) => {
              acc[curr] += 1;
              return acc;
            }, [0, 0, 0, 0, 0]);
            simEmbBarChart.update(labelNums, 50);

            // update embedding
            emb = data.emb;
            const embData = {
              position: emb
            }
            mainViewSplot.update(embData, 50, 0);

            // update latent value
            latentValues = data.latent_values;
            latentValues.forEach((val, i) => {
              document.getElementById("latent" + i).value = val * 10;
            });
           
          })();
        }, 100)
      }
    });

    latentViewRef.current.addEventListener('mousemove', (e) => {
      const xCoor = 2 * (e.offsetX / paneSize) - 1;
      const yCoor = 2 * ((paneSize - e.offsetY) / paneSize) - 1;
      dragCurrentPosition = [xCoor, yCoor];
    });
    
    latentViewRef.current.addEventListener('mouseup', (e) => {
      clearInterval(draggingInterval);
      if (draggingLatentPos) {
        draggingLatentPos = false;
        latentcoor = [dragCurrentPosition[0], dragCurrentPosition[1]];
        // console.log("End dragging");
      }
    })

  }, [props])
  return (
    <Box component="div"
      sx={{width: size * 2.5,
        // border: '1px solid grey',
        borderRadius: '5px',
        display: 'flex',
        marginTop: '10px',
        }}>
          <Grid container spacing={0}>
          <Grid  container item spacing={1} xs={5}>
            <Box>
      {/* <div 
        id={"latentview"}
        style={{
          width: size,
          height: size,
          margin: margin
          
        }}
      > */}
        <Paper
          sx={{
            boxShadow: 1,
            borderRadius: 1,
            margin: '5ox',
            padding: '5px',
            height: '100%'
          }}
          >
        <div style={{marginBottom: 5}}>
          Latent Space Exploration
        </div>
        <ScrollBar
          dims={info[dataset].find(d => d.points == pointNum).model.find(m => m.idx == idx).dim}
          onChange={updateLatentValue}
          url={url}
          dataset={dataset}
          pointNum={pointNum}
        />

 
        <div style={{display: "flex"}}>
          <div style={{width: size * 0.4, height: paneSize}}>
            Similar Embeddings
            <svg ref={simEmbSvgRef}></svg>
          </div>
          <div>
            Dimensionally-Reduced Latent Space
          <canvas
            ref={latentViewRef}
            width={size * 2}
            height={size * 2}
            style={{
              border: "1px black solid",
              width: paneSize,
              height: paneSize,

            }}
          ></canvas>
          </div>
        </div>
      {/* </div> */}
      </Paper>
      </Box>
  </Grid>
  <Grid item spacing={1} xs={5}>
    <Box>
      <Paper
      sx={{
        boxShadow: 1,
        borderRadius: 1,
        margin: '5ox',
        padding: '5px',
      }}
      >
      <div
        id={"mainview"}
        style={{
          width: size,
          height: size,
          margin: margin
        }}
      >
        <canvas
          ref={mainViewRef}
          width={size * 4}
          height={size * 4}
          style={scatterplotStyle(size)}
        ></canvas>

      </div>
      </Paper>
      </Box>
      </Grid>
      <Grid item xs={2}>
      <Paper
          sx={{
            boxShadow: 1,
            borderRadius: 1,
            margin: '5ox',
            padding: '5px',
            height: '100%'
          }}
          >
        <div
          id={"captureView"}
          style={{
            marginTop: margin,
            width: size * 0.38,
            height: size,
          }}
        >
          <div 
            style={{height: size - 21, width: size * 0.38}}
            ref={captureViewRef}
          >
            {
              [0, 0, 0].map((d, i) => {
                return (
                  <div 
                    key={i} 
                    id={"capture" + i}
                    style={{display:'flex', marginBottom: 4, visibility: "hidden"}}
                  >
                    <canvas 
                      id={"capturecanvas" + i}
                      width={size * 1.4}
                      height={size * 1.4}
                      style={scatterplotStyle(size * 0.3)}
                      onClick={restoreCurrentCapture}
                      onMouseOver={mouseoverCapture}
                      onMouseOut={mouseoutCapture}
                    ></canvas>
                    <button 
                      id={"capturebutton" + i}
                      style={{
                        marginLeft: 5,
                        height: 22
                      }}
                      onClick={removeCurrentCapture}
                    >X</button>
                  </div>
                )
              })
            }
          </div>
          <button style={{width: size * 0.38, height: 23}} onClick={captureCurrentEmbedding}>Click to Capture!!</button>
        </div>
      </Paper>
      </Grid>
      </Grid>
     </Box>
  )
}


export default MainView;