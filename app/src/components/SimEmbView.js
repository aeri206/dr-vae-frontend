import React, { createRef, useEffect, useRef, useState } from 'react';
import { Grid, Box, Paper, Button, Divider, Typography } from '@mui/material';
import { getKnn } from '../helpers/server';
import { Scatterplot } from './subcomponents/scatterplot';



const SimEmbView = props => {
  
  console.log('simEmbView')
  let { latentValues } = props;
  const { size, url, n, colorData, restoreSimView, onUpdate } = props;


  let simSPlotsContainerRefs = useRef([]);
  simSPlotsContainerRefs.current = Array(n).fill(0).map((_, i) => simSPlotsContainerRefs.current[i] ?? createRef());
  
  let simSplotsRefs = useRef([]);
  simSplotsRefs.current = Array(n).fill(0).map((_, i) => simSplotsRefs.current[i] ?? createRef());

  let simSplotLatentValues = useRef([]);
  simSplotLatentValues.current = Array(n).fill(0).map((_, i) => simSplotLatentValues.current[i] ?? createRef());

  
  
  const [update, setUpdate] = useState(false);

  const radius = 8;

  

  
  const onClick = (async(values) => {
    
    latentValues = values.map((d, _) => d)
    
    const data = await getKnn(url, latentValues, n);
    
    data.latents.forEach((d, i) => {
      simSplotLatentValues.current[i].current = d;
    })

    // simSplotLatentValues = simSplotLatentValues.map((_, i) => data.latents[i])
    setUpdate(true)
    if (simSPlotsContainerRefs.current[0].current){
      data.embs.forEach((d, idx) => {
        simSPlotsContainerRefs.current[idx].current.update({ position: d}, 50, 0);
        
      });
    }
    else { // construct
      let sc  = data.embs.map((d, idx) => {
        // d; point_count, 2
        const sdata = {
          position: d,
          opacity: new Array(d.length).fill(1),
            color: colorData,
            border: new Array(d.length).fill(0),
            borderColor: new Array(d.length).fill([0, 0, 0]),
            radius: new Array(d.length).fill(radius),
        }
        
        const x = new Scatterplot(sdata, simSplotsRefs.current[idx].current)
        return x
      })
      
      sc.forEach((s, i) => {
        simSPlotsContainerRefs.current[i].current = s
      });
    }
  })

    return(<>
    <Grid container spacing={1} item xs={10}>
        <Box sx={{width: '100%'}}>
          <Paper>
            <div style={{marginBottom: 5}}>
              Top {n} similar original embeddings
            </div>
            <Button
                variant="outlined"
                sx={{margin: '5px'}}
                onClick={() => {
                  let x = onUpdate();
                  onClick(x)
                }}
                // onClick={onClick}
            >
                Update</Button>
                <Button
                variant="outlined"
                sx={{margin: '5px'}}
                onClick={() => {setUpdate(u => !u)}}
                >
                  {update? 'HIDE': 'SHOW'}
                </Button>
                
            <Divider sx={{margin: '0 5px 0 5px'}}/>
            {update && 
            <Grid container>
              {Array(n).fill(0).map((_, i) => {
                return(
                  <Grid item xs={3}>
                    <div style={{margin: '5px'}} onClick={() => {
                      restoreSimView(simSplotLatentValues.current[i].current)();
                    }
                      }>
                      <canvas
                        ref={simSplotsRefs.current[i]}
                        width={size}
                        height={size}
                        style={{
                          border: "1px black solid",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                      </canvas>

                    </div>
                    

                    <Box> Text </Box>

                  </Grid>

                )
                

              })}

            </Grid>
            }
          </Paper>
          
        </Box>
      </Grid>
    </>)
}

export default SimEmbView;