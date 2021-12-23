import React, { createRef, useEffect, useRef, useState } from 'react';
import { Grid, Box, Paper, Button, Divider, Typography } from '@mui/material';
import { getKnn } from '../helpers/server';
import { Scatterplot } from './subcomponents/scatterplot';
import * as d3 from "d3";


const methodsNum = ['umap', 'tsne', 'isomap', 'densmap', 'lle']

function embScale(embedding) {
	const xMax = d3.max(embedding.map(d => d[0]));
	const xMin = d3.min(embedding.map(d => d[0]));
	const yMax = d3.max(embedding.map(d => d[1]));
	const yMin = d3.min(embedding.map(d => d[1]));
	const xScale = d3.scaleLinear().domain([xMin, xMax]).range([-0.9, 0.9]);
	const yScale = d3.scaleLinear().domain([yMin, yMax]).range([-0.9, 0.9]);
	return embedding.map((d) => {
		return [xScale(d[0]), yScale(d[1])];
	});
}

const SimEmbView = props => {

  
  let { latentValues } = props;
  const { size, url, n, colorData, restoreSimView, getLatentValues } = props;

  


  let simSPlotsContainerRefs = useRef([]);
  simSPlotsContainerRefs.current = Array(n).fill(0).map((_, i) => simSPlotsContainerRefs.current[i] ?? createRef());
  
  let simSplotsRefs = useRef([]);
  simSplotsRefs.current = Array(n).fill(0).map((_, i) => simSplotsRefs.current[i] ?? createRef());

  let simSplotLatentValues = useRef([]);
  simSplotLatentValues.current = Array(n).fill(0).map((_, i) => simSplotLatentValues.current[i] ?? createRef());

  let originEmbeddings = useRef([]);
  originEmbeddings.current = Array(n).fill(0).map((_, i) => originEmbeddings.current[i] ?? createRef());

  let reconEmbeddings = useRef([]);
  reconEmbeddings.current = Array(n).fill(0).map((_, i) => reconEmbeddings.current[i] ?? createRef());

  let originParams = useRef([]);
  originParams.current = Array(n).fill(0).map((_, i) => originParams.current[i] ?? createRef());

  
  
  const [show, setShow] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [showRecon, setShowRecon] = useState(true);

  const radius = 8;


  useEffect(() => {

    setShow(false)
    setHasData(false)
    setShowRecon(true)

  }, [props])

  
  useEffect(() => {
    if (simSPlotsContainerRefs.current[0].current){
      Array(n).fill(0).map((_, idx) => {
        let pos = showRecon? reconEmbeddings.current[idx].current : originEmbeddings.current[idx].current
        // simSPlotsContainerRefs.current[idx].current.update({ position: d}, 50, 0);
        simSPlotsContainerRefs.current[idx].current.update({ position: pos}, 50, 0);
      })

    }

  }, [showRecon])

  
  const onClickUpdate = (async(values) => {
    
    latentValues = values.map((d, _) => d)
    
    const data = await getKnn(url, latentValues, n);
    data.files.forEach((d, i) => {
      originEmbeddings.current[i].current = embScale(d.emb);
      
      
      delete d.emb;
      d['method'] = methodsNum[data.labels[i]]
      originParams.current[i].current = d;
    })
    
    
    data.latents.forEach((d, i) => {
      simSplotLatentValues.current[i].current = d;
    })

    data.embs.forEach((d, i) => {
      reconEmbeddings.current[i].current = d;
    })
    
    setShow(true);
    setHasData(true);
    
    
    if (simSPlotsContainerRefs.current[0].current){
      data.embs.forEach((_, idx) => {
        let pos = showRecon? reconEmbeddings.current[idx].current : originEmbeddings.current[idx].current
        // simSPlotsContainerRefs.current[idx].current.update({ position: d}, 50, 0);
        simSPlotsContainerRefs.current[idx].current.update({ position: pos}, 50, 0);
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

  // console.log(originEmbeddings.current, 
  // originParams.current[i].current
  // {(Object.entries(originParams.current[i].current)).forEach((k, v) => {
  //   return(
  //     <div>HIHI</div>


  //   )
  // })}

    return(<>
    <Grid container spacing={1} item xs={10}>
        <Box sx={{width: '100%'}}>
          <Paper>
            <div style={{marginBottom: 5}}>
              Top {n} similar {showRecon? 'reconstructed': 'original'} embeddings
              </div>
            <Button
                variant="outlined"
                sx={{margin: '5px'}}
                onClick={() => {
                  let values = getLatentValues();
                  onClickUpdate(values)
                }}
                // onClick={() => {console.log(onUpdate())}}
            >
                Update</Button>
                <Button
                variant="outlined" // TODO
                sx={{ display:hasData? 'inline-flex': 'none'}}
                
                onClick={() => {setShow(u => !u)}}
                >
                  {show? 'HIDE': 'SHOW'} 
                  
                </Button> 
                <Button
                  variant="outlined"
                  sx={{margin: '5px', display:hasData? 'inline-flex': 'none'}}
                  onClick={() => {
                    if (hasData){
                      setShowRecon(s => !s)
                      setShow(true)
                    }
                    
                  }}
              >
                SHOW {showRecon? 'original': 'reconstructed'} embeddings
              </Button>
                
            <Divider sx={{margin: '0 5px 0 5px'}}/>
            {hasData && 
            <Grid container
              sx={{display:show?'flex': 'none' }}
            >
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
                      <Box>
                        {Object.keys(originParams.current[i].current).map(k => {
                          return(
                          <div>{k} : {originParams.current[i].current[k]}</div>
                          )})}

                      </Box>
                    </div>
                    

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