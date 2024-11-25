
import { BrowserRouter as Router, Route, Routes, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/NetworkPage';
import Servers from './pages/servers/Servers';
import Status from './components/servers/Status';
import SSH from './components/servers/SSH';
import NotFound from './pages/notfound/NotFound';
import Error from './pages/notfound/Error';
import { AuthProvider } from './components/servers/utils/AuthContext';
import ProtectedRoute from './components/servers/utils/ProtectedRoutes';
import Login from './pages/login/Login';
import MonitorServer from './components/servers/Summary';
import SignUp from './pages/login/SignUp';


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
const App = () => {
  return (
    <Router>
      <AuthWrapper />
    </Router>
  );
};

const AuthWrapper = () => {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<ProtectedRoute ><HomePage /></ProtectedRoute>} />
          <Route path="servers" element={<Outlet />}>
            <Route index element={<ProtectedRoute><Servers /></ProtectedRoute>} />
            <Route path="manage" element={<ProtectedRoute>Server Status Page</ProtectedRoute>} />
            <Route path=":id" element={<Outlet />}>
              <Route index path="status" element={<ProtectedRoute><Status /></ProtectedRoute>} />
              <Route path="monitor" element={<ProtectedRoute><MonitorServer /></ProtectedRoute>} />
              <Route path="ssh" element={<ProtectedRoute><SSH /></ProtectedRoute>} />
            </Route>
          </Route>
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

