import React, { useEffect, useRef } from 'react';

import { scatterplotStyle } from './subcomponents/styles';
import  "../css/mainview.css"


const MainView = (props) => {

  // CONSTANTs for managing layout / design
  const radius = props.radius;
  const size   = props.size;
  const margin = props.margin;

  const mainViewRef = useRef(null);
  const latentViewRef = useRef(null);


  useEffect(() => {

  }, []);



  // NOTE about latent variables
  const latentValNum = 5;
  const latentValArray = new Array(latentValNum).fill(0);

  function updateLatentValue(e) {
    const latentNum = parseInt(e.target.id.slice(6));  // get the current latent value attribute number
    console.log(latentNum)
  }


  return (
     <div className="functionViews" style={{width: size * 2.1}}>
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
     </div>
  )

}


export default MainView;