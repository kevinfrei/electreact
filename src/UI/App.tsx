import { RecoilRoot } from 'recoil';
import logo from '../logo.svg';
import './styles/App.css';
import Utilities, { Spinner } from './Utilities';

export default function App(): JSX.Element {
  return (
    <RecoilRoot>
      <span id="grabber">
        <Spinner label="Brief Communication. Please standby...">
          <Utilities />
        </Spinner>
      </span>
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
