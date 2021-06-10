import React, { useEffect, useRef } from 'react';

import { scatterplotStyle } from './subcomponents/styles';


const MainView = (props) => {

  // CONSTANTs for managing layout / design
  const radius = props.radius;
  const size   = props.size;
  const margin = props.margin;

  const splotRef = useRef(null);

  const latentValNum = 5;
  
  const latentValArray = new Array(latentValNum).fill(0);

  useEffect(() => {

  }, []);


  return (
     <div style={{display: 'flex'}}>
      <div 
        style={{
          width: size * 0.7,
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
      </div>
      <div
        style={{
          width: size,
          height: size
        }}
      >
        <canvas
          ref={splotRef}
          width={size * 4}
          height={size * 4}
          style={scatterplotStyle(size)}
        ></canvas>
      </div>
     </div>
  )

}


export default MainView;