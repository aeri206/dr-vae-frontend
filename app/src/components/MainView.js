import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";

import { Scatterplot } from "./subcomponents/scatterplot";
import { scatterplotStyle } from './subcomponents/styles';
import { barChart } from './subcomponents/barChart';
import { CaptureViewManage } from './subcomponents/captureViewManage'
import  "../css/mainview.css"
import { getLatentEmb, reconstruction, getKnn } from '../helpers/server';



const MainView = (props) => {

  // CONSTANTs for managing layout / design
  const radius = props.radius;
  const size   = props.size;
  const margin = props.margin;
  const methods = props.methods;
  const pointNum = props.pointNum;
  const labelData = props.labelData;
  const labelColors = props.labelColors;
  const embCategoryColors = props.embCategoryColors;
  const url = props.url;

  const mainViewRef = useRef(null);
  const latentViewRef = useRef(null);
  const simEmbSvgRef = useRef(null);
  const captureViewRef = useRef(null);
  
  let mainViewSplot, latentViewSplot;

  // CONSTANT datas (latent values / current embedding)
  let emb;
  let latentValues = [0, 0, 0, 0, 0];

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
  useEffect(async () => {
    // main view construction 
    emb = await reconstruction(url, latentValues);
    const data = {
      position: emb,
      opacity: new Array(pointNum).fill(1),
      color: colorData,
      border: new Array(pointNum).fill(0),
      borderColor: colorData,
      radius: new Array(pointNum).fill(radius),
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
    
    const latentData = {
      position: [latentKnnData.coor].concat(latentEmb),
      opacity: new Array(latentEmb.length + 1).fill(1),
      color: [[255, 255, 255]].concat(latentColorData),
      border:[20].concat(new Array(latentEmb.length).fill(0)),
      borderColor: [[0, 0, 0]].concat(latentColorData),
      radius: [radius * 2].concat(new Array(latentEmb.length).fill(radius * 0.5)),
    }

    // console.log(latentData)

    latentViewSplot = new Scatterplot(latentData, latentViewRef.current);

    simEmbBarChart = new barChart(
      simEmbSvgRef, 
      size * 0.4, 
      size * 0.405, 
      margin,
      methods
    );

    const labelNums = latentKnnData.labels.reduce((acc, curr) => {
      acc[curr] += 1;
      return acc;
    }, [0, 0, 0, 0, 0])
    simEmbBarChart.initialize(labelNums);

  }, [props]);

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
    captureViewManage.removeCapture(index)
  }

  function restoreCurrentCapture(e) {
    const index = e.target.id.slice(13);
    const [currlatentValues, embedding] = captureViewManage.returnInfo(index);
    mainViewSplot.update({ position: embedding }, 1000, 0);
    currlatentValues.forEach((val, i) => {
      document.getElementById("latent" + i).value = val * 10;
    })
  }

  function mouseoverCapture(e) { e.target.style.border = "2px solid black"; }

  function mouseoutCapture(e) { e.target.style.border = "1px solid black";}



  // NOTE about latent variables
  const latentValNum = 5;
  const latentValArray = new Array(latentValNum).fill(0);

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
      const coor = data.coor;
      const labels = data.labels;
      const labelNums = labels.reduce((acc, curr) => {
        acc[curr] += 1;
        return acc;
      }, [0, 0, 0, 0, 0])
      console.log(labelNums);

      simEmbBarChart.update(labelNums, 10);
      const latentData = {
        position: [coor].concat(latentEmb)
      }

      latentViewSplot.update(latentData, 10, 0)

    })();


  }


  return (
     <div className="functionViews" style={{width: size * 2.5}}>
      <div 
        id={"latentview"}
        style={{
          width: size,
          height: size,
          margin: margin
        }}
      >
        <div style={{marginBottom: 10}}>
          Latent Space Exploration
        </div>
        {latentValArray.map((_, i) => 
           (<div className="hparam" key={i}>
              <div className="hname">Val {i}</div> 
              <input 
                id={"latent" + i}
                type="range"
                min={-15} 
                max={15}
                defaultValue={0} 
                className="slider"
                onChange={updateLatentValue}
              />
           </div>)
        )}
 
        <div style={{display: "flex"}}>
          <div style={{width: size * 0.5, height: size * 0.5}}>
            Similar Embeddings
            <svg ref={simEmbSvgRef}></svg>
          </div>
          <canvas
            ref={latentViewRef}
            width={size * 2}
            height={size * 2}
            style={scatterplotStyle(size * 0.5)}
          ></canvas>
        </div>
      </div>
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
     </div>
  )

}


export default MainView;