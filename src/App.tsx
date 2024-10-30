
import { BrowserRouter as Router, Route, Routes, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/NetworkPage';
import Servers from './pages/servers/Servers';
import Status from './components/servers/Status';
import SSH from './components/servers/SSH';
import NotFound from './pages/notfound/NotFound';
import Error from './pages/notfound/Error';
import Login from './pages/login/Login';

const Layout: React.FC = () => {
  const location = useLocation();

  const isNotFoundPage = location.pathname === '/404';

  return (
    <div className="min-h-screen overflow-hidden">
      {!isNotFoundPage && <Navbar />}
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="servers" element={<Outlet />}>
            <Route index element={<Servers />} />
            <Route path="manage" element={<>Server Status Page</>} />
            <Route path=":id" element={<Outlet />} >
              <Route index path='status' element={<Status />} />
              <Route path="summary" element={<>Server Summary Page</>} />
              <Route path="ssh" element={<SSH server={{ host: 'localhost', password: "admin", username: "rizekishimaro" }} />} />
            </Route>
          </Route>
        </Route>

        {/* Define the NotFound route explicitly */}
        <Route path="/404" element={<NotFound />} />
        <Route path='/error' element={<Error />} />

        {/* Catch-all route for 404, redirect to /404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
export default App;

