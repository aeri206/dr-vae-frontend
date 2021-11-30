import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { Link as RouterLink, Route, MemoryRouter } from 'react-router-dom';


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
    console.log(data)
    Object.entries(info).forEach((d, datasetID) => {
        let name = d[0];
        let pointsArr = d[1];
    })

    const [open, setOpen] = useState(Array(Object.keys(info).length).fill(false));
    const [subOpen, setSubOpen] = useState(Object.values(info).map(d => Array(d.length).fill(false)))
    // console.log(subOpen)

    const handleClick = (idx) => (e) => {
        let newOpen = [...open];
        newOpen[idx] = !newOpen[idx];
        setOpen(newOpen)
      };

    const handleSubClick = (idx, subidx) => e => {
        let newSubOpen = [...subOpen];
        newSubOpen[idx][subidx] = !newSubOpen[idx][subidx];
        setSubOpen(newSubOpen);
    }

    return(
    <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        dense
        aria-labelledby="nested-list-subheader"
        subheader={
            <ListSubheader component="div" id="nested-list-subheader">
            Options
            </ListSubheader>
        }
    >
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
                    <Divider />
                </>
                
            ))}
    </List>
    )
}


export default SideBar;