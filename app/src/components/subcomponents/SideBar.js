import React, { useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Divider, Collapse, ListItemText,
  ListItemButton, ListItem, List, ListSubheader, Typography } from '@mui/material';
import { Link as RouterLink, Route, MemoryRouter } from 'react-router-dom';
import { fontSize } from '@mui/system';
import { getLatentEmb } from '../../helpers/server';


function ListItemLink(props) {
    const { primary, to } = props;
  
    const renderLink = React.useMemo(
      () =>
        React.forwardRef(function Link(itemProps, ref) {
          return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
        }),
      [to],
    );
  
    return (
      <li>
        <ListItem button sx={{ pl: 6 }} component={renderLink}>
          <ListItemText primary={primary} />
        </ListItem>
      </li>
    );
  }

const SideBar = props => {
  const { info, data } = props;
    Object.entries(info).forEach((d, datasetID) => {
        let name = d[0];
        let pointsArr = d[1];
    })

    const model = info[data.name].find(p => p.points == data.points).model.find(m => m.idx == data.idx);

    

    const [open, setOpen] = useState(Array(Object.keys(info).length).fill(false));
    const [subOpen, setSubOpen] = useState(Object.values(info).map(d => Array(d.length).fill(false)))
    const [len, setLen] = useState('');

    (async () => {
      await getLatentEmb(props.url).then(res => {
        setLen(res.emb.length)
      })
    })();

    // console.log(subOpen)

    const handleClick = (idx) => (e) => {
        let newOpen = [...open];
        if (newOpen[idx]){
          let newSubOpen = [...subOpen];
          newSubOpen[idx] = Array(subOpen[idx].length).fill(false)
          setSubOpen(newSubOpen)
        }
        newOpen[idx] = !newOpen[idx];
        setOpen(newOpen)
      };

    const handleSubClick = (idx, subidx) => e => {
        let newSubOpen = [...subOpen];
        newSubOpen[idx][subidx] = !newSubOpen[idx][subidx];
        setSubOpen(newSubOpen);
    }

    
    return(
    <>
    <Typography component="div" sx={{
      color: 'rgba(0, 0, 0, 0.6)',
      lineHeight: '48px',
      paddingLeft: '16px',
      paddingRight: '16px',
      fontWeight: 500,
      fontSize: '0.875rem'
    }}>
      Info
    </Typography>
    
    <Box sx={{marginLeft: '10px'}}>
    <Divider sx={{marginBottom: '5px'}}/>
    <Typography variant="caption" sx={{display:'block'}}><span style={{fontWeight: 600}}>dataset : </span>{`${data.name}`}</Typography>
    <Typography variant="caption" sx={{display:'block'}}><span style={{fontWeight: 600}}>#(points) : </span>{`${data.points}`}</Typography>
    <Typography variant="caption" sx={{display:'block'}}><span style={{fontWeight: 600}}>#(embeddings): </span>{`${len}`}</Typography>
    <Typography variant="caption" sx={{display:'block'}}><span style={{fontWeight: 600}}>model: </span>{`${model.type}`}</Typography>
    <Typography variant="caption" sx={{display:'block'}}><span style={{fontWeight: 600}}>latent dimension: </span>{`${model.dim}`}</Typography>
    <Typography variant="caption" sx={{ display:'block', overflowWrap: 'anywhere'}} ><span style={{fontWeight: 600}}>methods: </span>{`${model.methods.toString()}`}</Typography>
    </Box>
    <Divider sx={{marginTop: '5px'}}/>
      <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          dense
          aria-labelledby="nested-list-subheader"
          subheader={
            <>
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                sx={{
                  display:"flex", 
                  paddingTop: "4px", 
                  paddingBottom: "4px", 
                  height: "48px",
                  alignItems: "center",
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
                onClick={() => {
                  if (open.includes(true)){
                    setOpen(Array(Object.keys(info).length).fill(false))
                    setSubOpen(Object.values(info).map(d => Array(d.length).fill(false)))
                  } else {
                    setOpen(Array(Object.keys(info).length).fill(true))
                  }

                }}
                >
              <Typography component="div" sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                width: '100%',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}>Options </Typography>
              {(open.concat(subOpen.flat()).includes(true))?<ExpandLess /> : <ExpandMore />}
              </ListSubheader>
              
              </>
          }
      >
        <Divider sx={{marginLeft: '10px'}}/>
          {Object.keys(info).map((name, idx) => (
              <>
                  <ListItemButton onClick={handleClick(idx)}>
                      <ListItemText primary={name} />
                      {open[idx] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={open[idx]} timeout="auto" unmountOnExit>
                          <List dense component="div" disablePadding>
                              {
                                  info[name].map((p, subidx) => (<>
                                      <ListItemButton onClick={handleSubClick(idx, subidx)} sx={{ pl: 3 }}>
                                          <ListItemText primary={p.points} />
                                          {subOpen[idx][subidx] ? <ExpandLess /> : <ExpandMore />}
                                      </ListItemButton>
                                      <Collapse in={subOpen[idx][subidx]} timeout="auto" unmountOnExit>
                                          <List dense>
                                              {
                                                  p.model.map(m => <ListItemLink to={`/${name}/${p.points}/${m.idx}`} primary={`${m.dim}d - ${m.idx}`} />)
                                              }
                                              </List>
                                      </Collapse>
                                      </>
                                  ))

                              }
                          </List>
                      </Collapse>
                      <Divider sx={{marginLeft: '16px'}}/>
                  </>
                  
              ))}
      </List>
    </>
    )
}


export default SideBar;