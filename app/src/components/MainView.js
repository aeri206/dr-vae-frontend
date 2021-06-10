import React, { useEffect, useRef } from 'react';

import { scatterplotStyle } from './subcomponents/styles';


const MainView = (props) => {

  // CONSTANTs for managing layout / design
  const radius = props.radius;
  const size   = props.size;
  const margin = props.margin;

  const mainViewRef = useRef(null);
  const latentViewRef = useRef(null);

  const latentValNum = 5;
  
  const latentValArray = new Array(latentValNum).fill(0);

  useEffect(() => {

  }, []);


  return (
     <div style={{display: 'flex'}}>
      <div 
        id={"latentview"}
        style={{
          width: size,
          height: size,
          margin: margin
        }}
      >
        {latentValArray.map((_, i) => 
           (<div className="hparam">
              <div classNmae="hname" style={{width: 50}}>Val {i}</div> 
              <input 
                  type="range"
                  min={1} 
                  max={100}
                  defaultValue={50} 
                  className="slider"
              />
           </div>)
        )}
        <div style={{display: "flex"}}>
          <div style={{width: size * 0.5, height: size * 0.5}}>
            안녕안녕
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