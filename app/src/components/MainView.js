import React, { useEffect, useRef } from 'react';

import { scatterplotStyle } from './subcomponents/styles';
import { barChart } from './subcomponents/barChart';
import  "../css/mainview.css"


const MainView = (props) => {

  // CONSTANTs for managing layout / design
  const radius = props.radius;
  const size   = props.size;
  const margin = props.margin;
  const methods = props.methods;

  const mainViewRef = useRef(null);
  const latentViewRef = useRef(null);
  const simEmbSvgRef = useRef(null);

  // CONSTANTs for components
  let simEmbBarChart;


  useEffect(() => {

  }, []);

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



  // NOTE about latent variables
  const latentValNum = 5;
  const latentValArray = new Array(latentValNum).fill(0);

  function updateLatentValue(e) {
    const latentNum = parseInt(e.target.id.slice(6));  // get the current latent value attribute number
 
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
                min={1} 
                max={100}
                defaultValue={50} 
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
          height: size
        }}
      >

        </div>
     </div>
  )

}


export default MainView;