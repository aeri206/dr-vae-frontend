import './App.css';
// import FileUpload from './components/FileUpload';
import { Route, Routes, Navigate, useNavigate, useLocation} from "react-router-dom";

import MainView from './components/MainView';
import SideBar from './components/subcomponents/SideBar';

import { getLatentEmb, reload} from './helpers/server';
import { useEffect, useState, useRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';




import * as d3 from "d3";

const load_len = (async(url, dataset, pointNum, dom) => {
  await reload(url, dataset, pointNum).then(async () => {
    await getLatentEmb(url).then(res => {
      console.log(dom.current)
      // dom.current.innerText = res.emb.length;
    });
  })
})




let inputs = {}
let test_in = {}
// let inputs = require('./json/info.json')
const test = require('./json/info-property.json')


Object.keys(test).forEach(data => {
  test_in[data] = (test[data].map(p => p.points))
})

inputs = test_in;



function App() {
  const { pathname } = useLocation();
  let checkIdx = false;
  
  let name, points, idx;
  let dim;

  name = (pathname.split("/").length > 1) ? pathname.split("/")[1] : 'mnist';
  if (Object.keys(test).includes(name)){
    points = (pathname.split("/").length > 2) ? parseInt(pathname.split("/")[2]) : inputs['mnist'][0];
    if (test[name].find(d => d.points == points)){
      idx = (pathname.split("/").length > 3) ? parseInt(pathname.split("/")[3]): -1;
      if (test[name].find(d => d.points == points).model.find(m => m.idx == idx)){
        checkIdx = true;
        dim = test[name].find(d => d.points == points).model.find(m => m.idx == idx).dim;
      }
      else {
        idx = test[name].find(d => d.points == points).model[0].idx;
      }
    } else {
      console.log(test[name])
      points = test[name][0].points;
      idx = test[name][0].model[0].idx;
    }
  }
  else {
    name = 'mnist';
    points = inputs[name][0];
    idx = test[name].find(d => d.points == points).model[0].idx;
  }
  
  const data = {name, points, idx}
  // const [data, setData] = useState({name, points, idx});
  const numEmb = useRef(null);

  const size   = 600;
  const radius = 20;
  const margin = 10;
  const methodsNum = {'umap': 0, 'tsne': 1, 'isomap': 2, 'densmap': 3, 'lle': 4};
  // const methodsIdx = require('.')
  const embCategoryColors = d3.scaleOrdinal(d3.schemeDark2);
  const url = "http://127.0.0.1:5000/";
  // let labelData = require(`./json/${data}-${pointNum.toString()}-label.json`);
  // if (typeof labelData === 'object' && labelData !== null){
  //   labelData = Object.values(labelData)
  // }
  // const range = [-1.5, 1.5];

  // 왠지 모르겠는데 이렇게해야 에러안남
  embCategoryColors(0);
  embCategoryColors(1);
  embCategoryColors(2);
  embCategoryColors(3);
  //일케일케

  // load_len(url, data.name, data.points, numEmb)
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
          Dimensionality Reduction Explorer utilizing Generative Model
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 150,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 150, boxSizing: 'border-box' },
        }}
      >
         <Toolbar />
         {checkIdx && 
         <SideBar
          info={test}
          data={data}
          url={url}
         />
         }
        </Drawer>

        {/* <div style={{display: "flex"}}>
          <FileUpload
            width={size * 0.8 - 20}
            height={size * 0.385 - 20}
          />
          <ExampleView
            width={size * 1.72}
            height={size * 0.385 - 20}
            margin={margin}
            methods={methods}
            labelColors={labelColors}
            embCategoryColors={embCategoryColors}
            pointNum={pointNum}
            labelData={labelData}
          />
        </div> */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
        <Route path="/" element={<Navigate replace to={`/${data.name}/${data.points}/${data.idx}`} />} />
        <Route path=":dataset/:pointNum/" element={
          <Navigate replace to={`/${data.name}/${data.points}/${data.idx}`} />
        }
          />
            {
              !checkIdx && 
              <Route path="/*" element={
                <Navigate replace to={`/${data.name}/${data.points}/${data.idx}`} />
              } />
            }
            {
              checkIdx && 
          <Route path=":dataset/:pointNum/:idx" element={
            <MainView
            size={size}
            radius={radius}
            margin={margin}
            methodsNum={methodsNum}
            dim={dim}
            // embCategoryColors={embCategoryColors}
            // labelColors={labelColors}
            // data={propsData}
            // pointNum={propsPointNum}
            // labelData={labelData}
            url={url}
          />
            } />
          }
        </Routes>
        </Box>
    </Box>
  );
}

export default App;
