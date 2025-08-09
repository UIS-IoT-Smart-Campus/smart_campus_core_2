import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


import TitleComponent from "../SingleComponents/TitleComponent/TitleComponent"
import AppsTableComponent from "./InternalComponents/AppsTableComponent"
import { UserContext } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';


function AppsComponent() {

    const {user} = useContext(UserContext);   

    //Obtener host URL de variables de entorno
    const host_url = process.env.REACT_APP_HOST_URL;

    //Uses State
    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const[appList, setAppList] = useState([]);
    const[update, setUpdate] = useState(false);
    const[idDeleteApp, setIdDeleteApp] = useState(0);
    
    

    //Modals Logic
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const handledDeleteClose = () => setDeleteModal(false);
    const handleDeleteShow = () => setDeleteModal(true);


    //Variable para controlar valores del formulario
    const [formValues, setFormValues] = useState({
      appId:0,
      appName:""
    });

    
    

    //Consultar de apps
    useEffect(() =>{   
      
      const request_url = host_url + `/admin/api/v1/apps/user/${user.userId}`;

      fetch(request_url)
      .then((resp) => {
          return resp.json();
      })
      .then((data)=>{
        setAppList(data);
      })
    },[user,host_url])

    //Redirección en caso de no estár logeado
    if (!user){
      return <Navigate to="/login" />
    }

    //Show Create App
    const showCreateApp = () => {

      //Limpiar Formulario
      setFormValues({
        appId:0,
        appName:""
      })

      handleShow();
    }

    //Show Modal UpdateApp
    const showUpdateApp = (e, app) => {
      //Agregar Datos Formulario
      setFormValues({
          appId: app.appId,
          appName:app.appName
      })
      setUpdate(true);
      handleShow();
    }

    //Mostrar Modal Delete App
    const showDeleteApp = (e, appId) => {
        setIdDeleteApp(appId);
        handleDeleteShow();
    }


    //Send Create Delete App submin
    const createUpdateApp = function (e) {
      //Para prevenir el envio con Enter
      e.preventDefault();

      if(update){

        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appName: formValues.appName})
        };

        const request_url = host_url + `/admin/api/v1/apps/update/${formValues.appId}`;

        fetch(request_url, requestOptions)
          .then((response) =>response.json())
          .then((update_app)=> {
            var nextAppList = appList.map((app)=>{
              if(app.appId === formValues.appId){
                app.appName = update_app.appName;
              }
              return app;
            })
            setAppList(nextAppList);
          });
        
        //Limpiar Formulario
        setFormValues({
          appId:0,
          appName:""
        })

        setUpdate(false);
      } else {
        //Enviar Solicitud Creación
      
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appName: formValues.appName, userId: user.userId })
        };

        const request_url = host_url + "/admin/api/v1/apps/new";

        fetch(request_url, requestOptions)
          .then((response) =>response.json())
          .then((new_app)=> {
            setAppList(appList => [...appList,new_app]);
            console.log(new_app)
          });
        
        //Limpiar Formulario
        setFormValues({
          appId:0,
          appName:""
          })
      }

      //Cerrar modal
      handleClose();
    }
    
    const deleteApp = () =>{

      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      };

      const request_url = host_url + `/admin/api/v1/apps/delete/${idDeleteApp}`;

      //Send Delete App Request
      fetch(request_url, requestOptions)
          .then(() => {
            setAppList(appList.filter(app =>
                app.appId !== idDeleteApp
              ));
            setIdDeleteApp(0);
          });

      //cerrar modal
      handledDeleteClose();
    }

    //Handle formulario App
    const handleValores = (e) =>{
      setFormValues({
        ...formValues,
        [e.target.name]: e.target.value
      })
    }

  return (
    <div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Aplicación</Modal.Title>
          </Modal.Header>
        <Modal.Body>
            <form onSubmit={createUpdateApp}>
              <label htmlFor='appName' className='form-label fw-semibold'>Nombre de la Aplicación:</label><br />
              <input 
                type='text' 
                className='form-control'
                name='appName'
                id='appName'
                required={true}
                value={formValues.appName}
                onChange={handleValores}
              ></input>
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="success" onClick={createUpdateApp}>
              Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={deleteModal} onHide={handledDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Aplicación</Modal.Title>
          </Modal.Header>
        <Modal.Body>
            <p>¿Está seguro de eliminar su aplicación?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handledDeleteClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteApp}>
              Borrar
          </Button>
        </Modal.Footer>
      </Modal>
      <TitleComponent title="Aplicaciones"/>
      <div className='card shadow-sm p-3 mb-5 bg-body rounded'>
          <div className='card-body'>
              <h5 className='card-title fw-semibold mb-4'>Gestión de Aplicaciones</h5>
              <hr/>
              <button className="btn btn-success" onClick={showCreateApp}><i className="bi bi-window"></i><span className="ms-2">Crear Aplicación</span></button>
              <br/><br/>              
              <p className='mb-0'>Tus aplicaciones</p>
              <br/>
              <AppsTableComponent appList={appList} showUpdateApp={showUpdateApp} showDeleteApp={showDeleteApp} />
          </div>
      </div>
    </div>
  )
}

export default AppsComponent