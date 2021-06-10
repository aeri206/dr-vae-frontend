import './App.css';
import ExampleView from './components/ExampleView';
import FileUpload from './components/FileUpload';
import './components/MainView';
import MainView from './components/MainView';

function App() {



  const size   = 400;
  const radius = 3;
  const margin = 10;

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
            height={size * 0.35 - 20}
          />
          <ExampleView
            width={size * 1.32}
            height={size * 0.35 - 20}
          />
        </div>
        <MainView
          size={size} 
          radius={radius}
          margin={margin}
        />
      </div>
      <footer className="App-footer">
        
      </footer>
    </div>
  );
}

export default App;
