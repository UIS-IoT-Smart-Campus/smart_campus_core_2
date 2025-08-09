import 'bootstrap/js/dist/dropdown'
import './SidebarMenu.css'
import { Link } from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

function SidebarMenu() {

  const {user, setUser} = useContext(UserContext);

  if (user){
    return (
      <div className="bg-dark col-auto col-md-2 min-vh-100 d-flex justify-content-between flex-column">
            <div className="pt-3">
              <Link to="/" className="text-decoration-none text-white d-none d-sm-inline d-fex align-itemcenter ms-3">
                  <span className="ms-1 fs-4 d-none d-sm-inline"> Smart Campus UIS</span>
              </Link>
              <hr  className="text-secondary d-none d-sm-block "/>
              <ul className="nav nav-pills flex-column" >
                <li className="nav-item text-white fs-4 my-1">
                  <Link to="/" className="nav-link text-white fs-6" aria-current="page">
                    <i className="bi bi-speedometer2"></i>
                    <span className="ms-3 d-none d-sm-inline">Inicio</span>
                  </Link>                
                </li>
                <li className="nav-item text-white fs-4 my-1">
                  <Link to="/apps" className="nav-link text-white fs-6" aria-current="page">
                    <i className="bi bi-window"></i>
                    <span className="ms-3 d-none d-sm-inline">Apps</span>
                  </Link>                
                </li>
                <li className="nav-item text-white fs-4 my-1">
                  <Link to="/devices" className="nav-link text-white fs-6" aria-current="page">
                    <i className="bi bi-cpu"></i>
                    <span className="ms-3 d-none d-sm-inline">Dispositivos</span>
                  </Link>                
                </li>
                <li className="nav-item text-white fs-4 my-1">
                  <Link to="/models" className="nav-link text-white fs-6" aria-current="page">
                    <i className="bi bi-hdd"></i>
                    <span className="ms-3 d-none d-sm-inline">Modelos</span>
                  </Link>                
                </li>
              </ul>
            </div>
            <div className="dropdown open">
              <Link
                className="text-decoration-none text-white dropdown-toggle p-3"
                type="button"
                id="triggerId"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                to="/profile"
              >
                <i className="bi bi-person-circle"></i>
                <span className="ms-2 d-none d-sm-inline">{user.userName}</span>
              </Link>
              <div className="dropdown-menu" aria-labelledby="triggerId">
                {/*<Link to="/profile" className="dropdown-item">Profile</Link>*/}
                <Link to="/login" className="dropdown-item" onClick={()=>setUser(null)}>Logout</Link>
              </div>
            </div>
            
      </div>
    )
  } else {
    return null;
  }

  
}

export default SidebarMenu