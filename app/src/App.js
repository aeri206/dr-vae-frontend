import './App.css';
import './components/MainView';
import MainView from './components/MainView';

function App() {
  const size   = 400;
  const radius = 3;
  const margin = 10;

  return (
    <div className="App">
      <header className="App-header">
        VAE for Dimensionality Reduction Explorer
      </header>
      <div id="body">
        <MainView
          size={size} 
          radius={radius}
          margin={margin}
        />
      </div>
      <footer className="App-footer">
        Human-Computer Interaction 2021 Sprint Team 4
      </footer>
    </div>
  );
}

export default App;
