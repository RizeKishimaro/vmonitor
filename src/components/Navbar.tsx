
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar bg-base-200 sticky top-0 z-50">
      <div className="flex">
        <a className="btn btn-ghost normal-case text-xl">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Breezeicons-apps-48-utilities-energy-monitor.svg/48px-Breezeicons-apps-48-utilities-energy-monitor.svg.png"
            alt="logo"
          />
        </a>
        <a className="btn btn-ghost normal-case text-xl">VMonitor</a>
        <div className="flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li tabIndex={0} className="dropdown dropdown-hover">
              <Link to="servers" className="justify-between">
                Servers
                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path d="M12 16l-6-6h12z" />
                </svg>
              </Link>
              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link to="/servers">Status</Link></li>
                <li><Link to="/servers/manage">Manage</Link></li>
                <li><Link to="/servers/summary">Summary</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

