import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactGA from 'react-ga4';
import './index.css';
import { AppProvider } from './AppContext';
const TRACKING_ID = "G-";
ReactGA.initialize(TRACKING_ID);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

const isDarkMode = () => {
  return JSON.parse(localStorage.getItem('preferredMode') || 'false')
}

root.render(
  <BrowserRouter>
    <ToastContainer autoClose={2000} theme={isDarkMode() ? 'dark' : 'light'} />
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>,
);