import React, { useEffect, useRef } from 'react';

import { scatterplotStyle } from './subcomponents/styles';
import { barChart } from './subcomponents/barChart';
import { CaptureViewManage } from './subcomponents/captureViewManage'
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
  const captureViewRef = useRef(null);

  // CONSTANTs for components
  let simEmbBarChart;
  let captureViewManage;


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
                <div style={{display:'flex', marginBottom: 4}}>
                  <canvas 
                    key={i}
                    width={size * 1.4}
                    height={size * 1.4}
                    style={
                      scatterplotStyle(size * 0.3)
                    }
                  ></canvas>
                  <button style={{
                    marginLeft: 5,
                    height: 22

                  }}>X</button>
                 </div>
              )
            })
          }
        </div>
        <button style={{width: size * 0.38, height: 23}}>Click to Capture!!</button>
      </div>
     </div>
  )

}


export default MainView;