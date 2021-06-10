import './App.css';
import ExampleView from './components/ExampleView';
import FileUpload from './components/FileUpload';
import './components/MainView';
import MainView from './components/MainView';

import * as d3 from "d3";

function App() {

  const size   = 400;
  const radius = 3;
  const margin = 10;
  const methods = ["umap", "tsne", "isomap", "densmap", "lle"];
  const labelColors = d3.scaleOrdinal(d3.schemeCategory10);
  const pointNum = 400;

  return (
    <div className="App">
      <header className="App-header">
        <div>
        Dimensionality Reduction Explorer utilizing VAE 
          </div>
        <div className="us">
           (Human-Computer Interaction 2021 Sprint Team 4)
        </div>
      </header>
      <div id="body">
        <div style={{display: "flex"}}>
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
            pointNum={pointNum}
          />
        </div>
        <MainView
          size={size} 
          radius={radius}
          margin={margin}
          methods={methods}
        />
      </div>
      <footer className="App-footer">
        
      </footer>
    </div>
  );
}

export default App;
