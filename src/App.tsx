
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
        <Route path="/" element={<Layout />}>
          <Route index element={<ProtectedRoute ><HomePage /></ProtectedRoute>} />
          <Route path="servers" element={<Outlet />}>
            <Route index element={<ProtectedRoute><Servers /></ProtectedRoute>} />
            <Route path="manage" element={<ProtectedRoute>Server Status Page</ProtectedRoute>} />
            <Route path=":id" element={<Outlet />}>
              <Route index path="status" element={<ProtectedRoute><Status /></ProtectedRoute>} />
              <Route path="summary" element={<ProtectedRoute>Server Summary Page</ProtectedRoute>} />
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

