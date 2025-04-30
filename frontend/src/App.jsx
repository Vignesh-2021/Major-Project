import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { ScoreProvider } from './pages/ScoreContext.jsx';
import GlobalTimer from './components/GlobalTimer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TimerProvider } from './components/TimerContext';

function App() {
  return (
    <>
      <Navbar />
      <ScoreProvider>
        <TimerProvider>
          <GlobalTimer />
          <Outlet />
          <ToastContainer />
        </TimerProvider>
      </ScoreProvider>
    </>
  );
}

export default App;