import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";

import { Scatterplot } from "./subcomponents/scatterplot";
import { scatterplotStyle } from './subcomponents/styles';
import { barChart } from './subcomponents/barChart';
import { CaptureViewManage } from './subcomponents/captureViewManage'
import  "../css/mainview.css"
import { reconstruction } from '../helpers/reconstruction';



const MainView = (props) => {

  // CONSTANTs for managing layout / design
  const radius = props.radius;
  const size   = props.size;
  const margin = props.margin;
  const methods = props.methods;
  const pointNum = props.pointNum;
  const labelData = props.labelData;
  const labelColors = props.labelColors;
  const url = props.url;

  const mainViewRef = useRef(null);
  const latentViewRef = useRef(null);
  const simEmbSvgRef = useRef(null);
  const captureViewRef = useRef(null);
  
  let mainViewSplot;

  // CONSTANT datas (latent values / current embedding)
  let emb;
  let latentValues = [0, 0, 0, 0, 0];

  const colorData = labelData.map(idx => {
		const color = d3.rgb(labelColors(idx));
		return [color.r, color.g, color.b];
	});

  // CONSTANTs for components
  let simEmbBarChart;
  let captureViewManage;

  // NOTE Initial Embedding construction
  useEffect(async () => {
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
  }, [props]);
  


  // NOTE for constructing / managing similar embedding bar chart
  useEffect(() => {
    // data for testing
    const initialValues  = [15, 20, 4, 13, 30];
    const updateValues   = [20, 25, 2, 3, 20];

    simEmbBarChart = new barChart(
      simEmbSvgRef, 
      size * 0.4, 
      size * 0.405, 
      margin,
      methods
    );
    simEmbBarChart.initialize(initialValues);
    simEmbBarChart.update(updateValues, 1000);

  }, []);

  // NOTE for capture view
  useEffect(() => {
    captureViewManage = new CaptureViewManage(captureViewRef, size * 0.33);
  });

  function captureCurrentEmbedding(e) {
    const currCaptureNum = captureViewManage.currentCaptureNum();
    if (currCaptureNum === 3) {
      alert("Cannot add more captures!! Erase to add new capture.");
      return;
    }
    else { captureViewManage.addCapture([], []); }
  }

  function removeCurrentCapture(e) {
    const index = e.target.id.slice(13);
    captureViewManage.removeCapture(index)
  }

  function restoreCurrentCapture(e) {
    const index = e.target.id.slice(13);
    const [latentValue, embedding] = captureViewManage.returnInfo(index);
    // restoring하는거 짜야함
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