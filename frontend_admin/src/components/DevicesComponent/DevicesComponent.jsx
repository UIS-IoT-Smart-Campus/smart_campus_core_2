import { useContext, useEffect, useState } from "react";
import TitleComponent from "../SingleComponents/TitleComponent/TitleComponent"
import DeviceTableComponent from "./InternalComponents/DeviceTableComponent"
import { UserContext } from "../../context/UserContext";
import { Button, Modal } from "react-bootstrap";


function DevicesComponent() {

  const {user} = useContext(UserContext);

  //Obtener host URL de variables de entorno
  const host_url = process.env.REACT_APP_HOST_URL;

  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [deleteDeviceModal, setDeleteDeviceModal] = useState(false);
  const[deviceList, setDeviceList] = useState([]);
  const[modelList, setModelList] = useState([]);
  const[updateDevice, setUpdateDevice] = useState(false);
  const[idDeleteDevice, setIdDeleteDevice] = useState(0);

  //Modals Logic
  const handleDeviceModalClose = () => setShowDeviceModal(false);
  const handleDeviceModalShow = () => setShowDeviceModal(true);
  const handledDeleteDeviceClose = () => setDeleteDeviceModal(false);
  const handleDeleteDeviceShow = () => setDeleteDeviceModal(true);

  //Variable para controlar valores del formulario
  const [deviceFormValues, setDeviceFormValues] = useState({
    deviceId:0,
    deviceName:"",
    modelId:0
  });

  //Consultar dispositivos y modelos
  useEffect(() =>{      
    
    const request_url = host_url + `/admin/api/v1/devices/user/${user.userId}`;

    fetch(request_url)
    .then((resp) => {
        return resp.json();
    })
    .then((data)=>{
      setDeviceList(data);
    })

    const second_request_url = host_url + `/admin/api/v1/device-models/user/${user.userId}`;

    fetch(second_request_url)
    .then((resp) => {
        return resp.json();
    })
    .then((data)=>{
      setModelList(data);
    })

  },[user, host_url])

  const showCreateDevice = () => {
    setDeviceFormValues({
      deviceId:0,
      deviceName:"",
      modelId:0
    })
    handleDeviceModalShow();
  }

  const showUpdateDevice = (e, device) => {
    //Agregar Campos al Formulario
    setDeviceFormValues({
      deviceId:device.deviceId,
      deviceName:device.deviceName,
      modelId:device.model.modelId
    })
    setUpdateDevice(true);
    handleDeviceModalShow();
  }

  const showDeleteDevice = (e, deviceId) => {
    console.log(deviceId);
      setIdDeleteDevice(deviceId);
      handleDeleteDeviceShow();
  }

  const createUpdateDevice = () =>{
    
    if (updateDevice) {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceName: deviceFormValues.deviceName, modelId: deviceFormValues.modelId })
      };

      const request_url = host_url + `/admin/api/v1/devices/update/${deviceFormValues.deviceId}`;

      fetch(request_url, requestOptions)
        .then((response) => response.json())
        .then((update_device) => {
          console.log(update_device);
          var nextDeviceList = deviceList.map((device) => {
            if (device.deviceId === deviceFormValues.deviceId) {
              device.deviceName = update_device.deviceName;
              device.model = update_device.model;
            }
            return device;
          })
          console.log("good");
          setDeviceList(nextDeviceList);
          //Limpiar Formulario
          setDeviceFormValues({
            deviceId:0,
            deviceName:"",
            modelId:0
          })
          console.log("good2");
          handleDeviceModalClose();
          setUpdateDevice(false);
        });        
    } else {

      if(deviceFormValues.modelId !== 0){
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceName: deviceFormValues.deviceName, modelId: deviceFormValues.modelId, userId: user.userId })
        };

        const request_url = host_url + '/admin/api/v1/devices/new';
  
        fetch(request_url, requestOptions)
          .then((response) => response.json())
          .then((new_device) => {
            setDeviceList(deviceList => [...deviceList, new_device]);
            setDeviceFormValues({
              deviceId:0,
              deviceName:"",
              modelId:0
            })
            handleDeviceModalClose();
          })
      } else {
        handleDeviceModalClose();
      }      
    }
  }

  const deleteDevice = () =>{
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };

    const request_url = host_url + `/admin/api/v1/devices/delete/${idDeleteDevice}`;

    //Send Delete App Request
    fetch(request_url, requestOptions)
      .then(() => {
        setDeviceList(deviceList.filter(device =>
          device.deviceId !== idDeleteDevice
        ));
        setIdDeleteDevice(0);
        //cerrar modal
        handledDeleteDeviceClose();
      });
  }

  //Handle formulario Device
  const handleDeviceValores = (e) =>{
    setDeviceFormValues({
      ...deviceFormValues,
      [e.target.name]: e.target.value
    })
  }


  return (
    <div>
      <Modal show={showDeviceModal} onHide={handleDeviceModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Modelo</Modal.Title>
          </Modal.Header>
        <Modal.Body>
            <form onSubmit={createUpdateDevice}>
              <label htmlFor='deviceName' className='form-label fw-semibold'>Nombre del Modelo:</label><br />
              <input 
                type='text' 
                className='form-control mb-2'
                name='deviceName'
                id='deviceName'
                required={true}
                value={deviceFormValues.deviceName}
                onChange={handleDeviceValores}
              ></input>
              <label htmlFor='modelId' className='form-label fw-semibold'>Modelo de Dispositivo:</label><br />
              <select 
                type='text' 
                className='form-select'
                name='modelId'
                id="modelId"
                required={true}
                value={deviceFormValues.modelId}
                onChange={handleDeviceValores}
              >
                <option value={0}>Seleccionar Modelo</option>
                {
                  modelList &&
                  modelList.map((model)=>{
                    return(
                      <option key={model.modelId} value={model.modelId}>{model.modelName}</option>
                    )
                  })
                }
              </select>
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeviceModalClose}>
            Cancelar
          </Button>
          <Button variant="success" onClick={createUpdateDevice}>
              Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={deleteDeviceModal} onHide={handledDeleteDeviceClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Dispositivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro de eliminar este Dispositivo?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handledDeleteDeviceClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteDevice}>
            Borrar
          </Button>
        </Modal.Footer>
      </Modal>
      <TitleComponent title="Dispositivos" />     
      <div className='card shadow-sm p-3 mb-5 bg-body rounded'>
        <div className='card-body'>
          <h5 className='card-title fw-semibold mb-4'>Gestión de Dispositivos</h5>
          <hr />
          <button className="btn btn-success" onClick={showCreateDevice}><i className="bi bi-cpu"></i><span className="ms-2">Crear Dispositivo</span></button>
          <br/><br/>   
          <p className='mb-0'>Tus dispositivos</p>
          <br/>
          <DeviceTableComponent deviceList={deviceList} showUpdateDevice={showUpdateDevice} showDeleteDevice={showDeleteDevice}/>
        </div>
      </div>
    </div>
  )
}

export default DevicesComponent