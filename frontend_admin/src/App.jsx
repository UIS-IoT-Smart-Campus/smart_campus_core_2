import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SidebarMenu from './components/SidebarMenu/SidebarMenu';
import HomeComponent from './components/HomeComponent/HomeComponent';
import AppsComponent from './components/AppsComponent/AppsComponent';
import DevicesComponent from './components/DevicesComponent/DevicesComponent';
import ModelsComponent from './components/ModelsComponent/ModelsComponent';
import ProfileComponent from './components/ProfileComponent/ProfileComponent';
import LoginComponent from './components/LoginComponent/LoginComponent';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import ModelDetailComponent from './components/ModelsComponent/ExtendsComponents/ModelDetailComponent';
import DeviceDetailComponent from './components/DevicesComponent/ExtendsComponents/DeviceDetailComponent';
import AppDetailComponent from './components/AppsComponent/ExtendsComponents/AppDetailComponent';
import RegisterComponent from './components/LoginComponent/RegisterComponent';


function App() {
  
  
  return (
    <div className="App">
      <div className="container-fluid">
        <UserProvider>
          <BrowserRouter>
            <div className='row'>
              <SidebarMenu/>              
              <div className='col min-vh-100 p-5 justify-content-between contenedor-componente'>
                <Routes>
                  <Route path='/login' element={<LoginComponent/>}></Route>
                  <Route path='/register' element={<RegisterComponent/>}></Route>
                  <Route path='/' element={<ProtectedRoute><HomeComponent /></ProtectedRoute>} />
                  <Route path='/apps' element={<ProtectedRoute><AppsComponent /></ProtectedRoute>} />
                  <Route path='/app/detail/:appId' element={<ProtectedRoute><AppDetailComponent /></ProtectedRoute>} />
                  <Route path='/devices' element={<ProtectedRoute><DevicesComponent /></ProtectedRoute>} />
                  <Route path='/device/detail/:deviceId' element={<ProtectedRoute><DeviceDetailComponent /></ProtectedRoute>} />
                  <Route path='/models' element={<ProtectedRoute><ModelsComponent /></ProtectedRoute>} />
                  <Route path='/model/detail/:modelId' element={<ProtectedRoute><ModelDetailComponent /></ProtectedRoute>} />
                  <Route path='/profile' element={<ProtectedRoute><ProfileComponent /></ProtectedRoute>} />
                </Routes>
              </div>            
            </div>
          </BrowserRouter>   
        </UserProvider>       
      </div>
      
      
    </div>
  );
}

export default App;
