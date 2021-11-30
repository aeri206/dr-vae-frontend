import React, { useEffect, useState } from 'react';
import { getDim } from '../../helpers/server';

const ScrollBar = props => {
    const [dims, setDims] = useState(0);
    console.log('scroll-bar')

    useEffect(() => {
        (async () => {
            await getDim(props.url, props.dataset, props.pointNum).then(res => {
                setDims(res)
            });
        })();

    }, [props]);

    return(<div>
        {Array(dims).fill(0).map((_, i) => (
            <div className="hparam" key={i}>
           <div className="hname">Val {i}</div> 
           <input 
             id={"latent" + i}
             type="range"
             min={-15} 
             max={15}
             defaultValue={0} 
             className="slider"
             onChange={props.onChange}
           />
        </div>)
        )}
        

        </div>)

}


export default ScrollBar;