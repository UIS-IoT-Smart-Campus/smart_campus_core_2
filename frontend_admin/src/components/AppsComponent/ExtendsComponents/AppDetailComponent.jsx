import { useContext, useEffect, useState } from "react";
import TitleComponent from "../../SingleComponents/TitleComponent/TitleComponent";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { Button, Modal } from "react-bootstrap";

function AppDetailComponent() {

    const {user} = useContext(UserContext);

    //Obtener host URL de variables de entorno
    const host_url = process.env.REACT_APP_HOST_URL;

    const [showDeviceAppModal, setShowDeviceAppModal] = useState(false);
    const [removeDeviceAppModal, setRemoveDeviceAppModal] = useState(false);
    const [removeDeviceAppId, setRemoveDeviceAppId] = useState(0);
    const[deviceList, setDeviceList] = useState([]);

    const pAppId = useParams().appId;

    const handleShowDeviceAppModal = () => setShowDeviceAppModal(true);
    const handleCloseDeviceAppModal = () => setShowDeviceAppModal(false);
    const handleShowRemoveDeviceAppModal = () => setRemoveDeviceAppModal(true);
    const handleCloseRemoveDeviceAppModal = () => setRemoveDeviceAppModal(false);

    const [app, setApp] = useState({
        appId: pAppId,
        appName: "",
        creationDate: "",
        appDevices: []
    });

    //Variable para controlar valores del formulario
    const [deviceAppFormValues, setDeviceAppFormValues] = useState({
        deviceId:0
    });

    useEffect(()=>{

        const request_url = host_url + `/admin/api/v1/apps/${pAppId}`;

        fetch(request_url)
            .then((response) => {
                return response.json()
            })
            .then((appReponse) => {                
                appReponse.creationDate = new Date(appReponse.creationDate).toLocaleString("es-CO").replace(',', '');
                setApp(appReponse)
                const second_resquest_url = host_url + `/admin/api/v1/devices/user/${user.userId}`
                fetch(second_resquest_url)
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        if (data && data.length > 0) {
                            if (appReponse.appDevices && appReponse.appDevices.length > 0) {
                                let devicesIds = appReponse.appDevices.map(di => di.deviceId);
                                let validDevicesList = data.filter(device => !devicesIds.includes(device.deviceId));
                                    setDeviceList(validDevicesList);
                            } else {
                                setDeviceList(data);
                            }

                        } else {
                            setDeviceList([]);
                        }
                    })
            })
        
        


    },[pAppId,user, host_url])

    const showRemoveDeviceApp = (e, deviceId) => {
        setRemoveDeviceAppId(deviceId)
        handleShowRemoveDeviceAppModal();
    }

    const addDeviceApp = () => {
        if(deviceAppFormValues.deviceId !== 0){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appId: app.appId, deviceId:deviceAppFormValues.deviceId})
            };

            const request_url = host_url + "/admin/api/v1/apps/add/device/";
    
            fetch(request_url, requestOptions)
            .then((response) =>response.json())
            .then((appResponse)=> {
                setApp(appResponse);
                //Limpiar Formulario
                setDeviceAppFormValues({
                    deviceId:1
                })
    
                let devicesIds = appResponse.appDevices.map(di => di.deviceId);
                let validDevicesList = deviceList.filter(device => !devicesIds.includes(device.deviceId));
                setDeviceList(validDevicesList);
    
                handleCloseDeviceAppModal();
            });
        } else {
            handleCloseDeviceAppModal();
        }
    }

    const removeDeviceApp = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appId: app.appId, deviceId:removeDeviceAppId})
        };

        const request_url = host_url + "/admin/api/v1/apps/remove/device/";

        //Send Delete App Request
        fetch(request_url, requestOptions)
            .then((res)=>{return res.json()})
            .then((appReponse) => {
                appReponse.creationDate = new Date(appReponse.creationDate).toLocaleString("es-CO").replace(',', '');
                setApp(appReponse);
                const second_request_url = host_url + `/admin/api/v1/devices/user/${user.userId}`
                fetch(second_request_url)
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        if (data && data.length > 0) {
                            if (appReponse.appDevices && appReponse.appDevices.length > 0) {
                                let devicesIds = appReponse.appDevices.map(di => di.deviceId);
                                let validDevicesList = data.filter(device => !devicesIds.includes(device.deviceId));
                                    setDeviceList(validDevicesList);
                            } else {
                                setDeviceList(data);
                            }

                        } else {
                            setDeviceList([]);
                        }
                    });

                setRemoveDeviceAppId(0);
                //cerrar modal
                handleCloseRemoveDeviceAppModal();
            });  
    }

    //Handle formulario App
    const handleDeviceAppForm = (e) => {
        setDeviceAppFormValues({
            ...deviceAppFormValues,
            [e.target.name]: e.target.value
        })
    }

  return (
      <div>
          <Modal show={showDeviceAppModal} onHide={handleCloseDeviceAppModal}>
              <Modal.Header closeButton>
                  <Modal.Title>Asociar Dispositivo</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <form onSubmit={addDeviceApp}>
                      <label htmlFor='deviceId' className='form-label fw-semibold'>Nombre de la Propiedad:</label><br />
                      <select
                          type='text'
                          className='form-select'
                          name='deviceId'
                          id="deviceId"
                          required={true}
                          value={deviceAppFormValues.modelId}
                          onChange={handleDeviceAppForm}
                      >
                          <option value={0}>Seleccionar Dispositivo</option>
                          {
                              deviceList &&
                              deviceList.map((device) => {
                                  return (
                                      <option key={device.deviceId} value={device.deviceId}>{device.deviceName}</option>
                                  )
                              })
                          }
                      </select>
                  </form>
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDeviceAppModal}>
                      Cancelar
                  </Button>
                  <Button variant="success" onClick={addDeviceApp}>
                      Asociar
                  </Button>
              </Modal.Footer>
          </Modal>
          <Modal show={removeDeviceAppModal} onHide={handleCloseRemoveDeviceAppModal}>
              <Modal.Header closeButton>
                  <Modal.Title>Remove Dispositivo</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <p>¿Está seguro de remover este Dispositivo de la Aplicación?</p>
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseRemoveDeviceAppModal}>
                      Cancelar
                  </Button>
                  <Button variant="danger" onClick={removeDeviceApp}>
                      Borrar
                  </Button>
              </Modal.Footer>
          </Modal>
          <TitleComponent title={app.appName} />
          <div className='card shadow-sm p-3 mb-5 bg-body rounded'>
              <div className='card-body'>
                  <h4 className='card-title fw-semibold mb-4'>Aplicación</h4>
                  <p className='mb-0'>Información de la Aplicación</p>
                  <table className="table">
                      <tbody>
                          <tr>
                              <td><b>Nombre:</b></td>
                              <td>{app.appName}</td>
                              <td><b>Fecha Creación:</b></td>
                              <td>{app.creationDate}</td>
                          </tr>
                      </tbody>
                  </table>
                  <br />
                  <h4 className="fw-semibold mb-4">Dispositivos</h4>
                  <button className="btn btn-success mb-4" onClick={handleShowDeviceAppModal}><i className="bi bi-plus-circle"></i><span className="ms-2">Agregar Dispositivo</span></button>
                  <p>Lista del Dispositivos Asociados</p>
                  <table className="table table-hover table-bordered text-center">
                      <thead className="table-secondary">
                          <tr>
                              <th scope="col">Nombre</th>
                              <th scope="col">Fecha Creación</th>
                              <th scope="col">Tipo</th>
                              <th scope="col">Acciones</th>
                          </tr>
                      </thead>
                      <tbody>
                          {
                              app.appDevices &&
                              app.appDevices.map((device) => {
                                  let d = new Date(device.creationDate).toLocaleString("es-CO").replace(',', '');
                                  return (
                                      <tr key={device.deviceId}>
                                          <td>{device.deviceName}</td>
                                          <td>{d}</td>
                                          <td>{device.model.type}</td>
                                          <td><button className="btn btn-sm btn-danger ms-2" onClick={(e) => showRemoveDeviceApp(e,device.deviceId)}><i className="bi bi-trash"></i></button></td>
                                      </tr>
                                  )
                              })
                          }
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  )
}

export default AppDetailComponent