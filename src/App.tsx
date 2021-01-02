import { RecoilRoot } from 'recoil';
import './App.css';
import logo from './logo.svg';
import { Utilities } from './Recoil/Helpers';

function App() {
  return (
    <RecoilRoot>
      <Utilities />
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div>
            Chrome Version: <span id="chrome-version"></span>
          </div>
          <div>
            Node Version: <span id="node-version"></span>
          </div>
          <div>
            Electron Version: <span id="electron-version"></span>
          </div>
        </header>
      </div>
    </RecoilRoot>
  );
}

export default App;
