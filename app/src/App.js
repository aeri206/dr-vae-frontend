import './App.css';
// import FileUpload from './components/FileUpload';
import { Route, Routes, Navigate, useNavigate, useLocation} from "react-router-dom";
import './components/MainView';
import MainView from './components/MainView';
import { getLatentEmb, reload} from './helpers/server';
import { useEffect, useState, useRef, useCallback } from 'react';



import * as d3 from "d3";

const load_len = (async(url, dataset, pointNum) => {
  await reload(url, dataset, pointNum).then(async () => {
    await getLatentEmb(url).then(res => {
      document.querySelector('#num_emb').innerText = res.emb.length;
    });
  })
})



const inputs = {
  'spheres':[2000],
  'grid10':[1000],
  'grid6':[216, 1296, 7776],
  'mammoth':[5000],
  'interleaved':[2318],
  'mnist': [1000]
}




function App() {
  const { pathname } = useLocation();
  let navigate = useNavigate();

  let name = (pathname.split("/").length > 2) ? pathname.split("/")[1] : 'mnist';
  let points = (pathname.split("/").length > 2) ? parseInt(pathname.split("/")[2]) : inputs['mnist'][0];
  
  const [data, setData] = useState({name, points});
  
  const pointNumSelect = useRef(null);

  const updateData = useCallback(() => {
    pointNumSelect.current.innerHTML = '';
    pointNumSelect.current.append()
    inputs[data.name].forEach(size => {
      let li = document.createElement('li');
      let btn = document.createElement('button');
      btn.classList.add("dropdown-item");
      btn.setAttribute("type", "button");
      btn.setAttribute("value", size)

      btn.addEventListener('click', () => {
        if (size !== data.points){
          navigate(`/${data.name}/${size}`)
        }
      })
      btn.innerText = size;
      pointNumSelect.current.appendChild(li.appendChild(btn));
    });

  }, [data.name, data.points, navigate])

  useEffect(() => {
    updateData();
    // pointNumSelect.current.innerHTML = '';
    // pointNumSelect.current.append()
    // inputs[data.name].forEach(size => {
    //   let li = document.createElement('li');
    //   let btn = document.createElement('button');
    //   btn.classList.add("dropdown-item");
    //   btn.setAttribute("type", "button");
    //   btn.setAttribute("value", size)

    //   btn.addEventListener('click', () => {
    //     if (size !== data.points){
    //       navigate(`/${data.name}/${size}`)
    //     }
    //   })
    //   btn.innerText = size;
    //   pointNumSelect.current.appendChild(li.appendChild(btn));
    // });
  }, [data.name, updateData])

  if (data.points !== points){
    setData({...data, points: points})
  }

  const size   = 600;
  const radius = 20;
  const margin = 10;
  const methods = ["umap", "tsne", "isomap", "densmap", "lle"];
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

  load_len(url, data.name, data.points)
  return (
    <div className="App">
      <header className="App-header">
        <div>
        <div>
        Dimensionality Reduction Explorer utilizing VAE   #(embedding): <span id="num_emb"></span> </div>
        </div>
      </header>
      <div id="body">
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
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownDataset" data-bs-toggle="dropdown" aria-expanded="false">Dataset: {data.name}</button>
          <ul className="dropdown-menu" aria-labelledby="dropdownDataset">
            {Object.keys(inputs).map(i => (<li><button className="dropdown-item" type="button" onClick={() => {
              if (i !== data.name){
                console.log(data)
                setData({name: i, points: inputs[i][0]});
                console.log(data)
                navigate(`/${i}/${inputs[i][0]}`);
              }
              }}>{i}</button></li>))}
          </ul>
        </div>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownPointNum" data-bs-toggle="dropdown" aria-expanded="false"># points: {data.points}</button>
          <ul className="dropdown-menu" aria-labelledby="dropdownPointNum" ref={pointNumSelect}>
          </ul>
        </div>
        <Routes>
        <Route path="/" element={<Navigate replace to={`/${data.name}/${data.points}`} />} />
          <Route path=":dataset/:pointNum" element={
          <MainView
          size={size} 
          radius={radius}
          margin={margin}
          methods={methods}
          // embCategoryColors={embCategoryColors}
          // labelColors={labelColors}
          // data={propsData}
          // pointNum={propsPointNum}
          // labelData={labelData}
          url={url}
        />
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
