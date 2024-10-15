
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/NetworkPage';
import Servers from './pages/servers/Servers';
import Status from './components/servers/Status';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="servers" element={<Outlet />} >
              <Route index element={<Servers />} />
              <Route path="manage" element={<>Server Status Page</>} />
              <Route path=":id/status" element={<Status />} />
              <Route path="summary" element={<>Server Summary Page</>} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

