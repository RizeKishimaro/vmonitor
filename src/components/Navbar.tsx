
import { Link, useParams } from 'react-router-dom';
import logo from "/logo.png"

const Navbar = () => {
  const { id } = useParams();
  console.log(id)
  return (
    <div>
      <div className="navbar bg-base-200 sticky top-0 z-50 w-full">
        <div className="flex w-full items-center">
          <a className="btn bg-transparent normal-case text-xl">
            <img
              className='rounded-full'
              width={50}
              src={logo}
              alt="logo"
            />
          </a>
          <a className="btn btn-ghost h-full normal-case text-xl lg:flex hidden lg:visible items-center">VMonitor</a>
          <div className="flex ">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li tabIndex={0} className="dropdown dropdown-hover">
                <Link to="#" className="justify-between">
                  Servers
                  <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path d="M12 16l-6-6h12z" />
                  </svg>
                </Link>
                <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><Link to="/servers">Manage</Link></li>
                  {id && (
                    <>
                      <li><Link to={`/servers/${id}/monitor`}>Summary</Link></li>
                      <li><Link to={`/servers/${id}/ssh`}>SSH</Link></li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </div>
          <div className='ml-auto mr-3'>
            <a className="btn rounded-full">
              <div className="avatar online">
                <div className="w-12 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
            </a>
          </div>

        </div>

      </div>
      <div className='p-3 text-center bg-base-300 text-red-500'>This Project is build by RizeKishimaro,Min Hein Ko Ko,Nyan Lin Bo and not Contributed By <a className='underline' href='https://github.com/htoomthait/'>Htoo Maung Thait!</a></div>

    </div>
  );
};

export default Navbar;

