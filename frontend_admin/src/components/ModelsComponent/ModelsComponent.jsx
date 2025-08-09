import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import TitleComponent from "../SingleComponents/TitleComponent/TitleComponent";
import ModelsTableComponent from "./InternalComponents/ModelsTableComponent";
import { Button, Modal } from "react-bootstrap";

function ModelsComponent() {

  const {user} = useContext(UserContext);

  //Obtener host URL de variables de entorno
  const host_url = process.env.REACT_APP_HOST_URL;

  //Uses State
  const [showModelModal, setShowModelModal] = useState(false);
  const [deleteModelModal, setDeleteModelModal] = useState(false);
  const[modelList, setModelList] = useState([]);
  const[updateModel, setUpdateModel] = useState(false);
  const[idDeleteModel, setIdDeleteModel] = useState(0);

  //Modals Logic
  const handleModelModalClose = () => setShowModelModal(false);
  const handleModelModalShow = () => setShowModelModal(true);
  const handledDeleteModalClose = () => setDeleteModelModal(false);
  const handleDeleteModalShow = () => setDeleteModelModal(true);

  //Variable para controlar valores del formulario
  const [modelFormValues, setModelFormValues] = useState({
    modelId:0,
    modelName:"",
    type:"SENSOR"
  });

  //Consultar de modelos
  useEffect(() =>{      

    const request_url = host_url + `/admin/api/v1/device-models/user/${user.userId}`;

    fetch(request_url)
    .then((resp) => {
        return resp.json();
    })
    .then((data)=>{
      setModelList(data);
    })
  },[user,host_url])

  //Show Create Model
  const showCreateModel = () => {
    //Limpiar Formulario
    setModelFormValues({
      modelId: 0,
      modelName:"",
      type:"SENSOR"
    })

    handleModelModalShow();
  }

  //Show Modal Update Model
  const showUpdateModel = (e, model) => {
    //Agregar Datos Formulario
    setModelFormValues({
      modelId: model.modelId,
      modelName:model.modelName,
      type:model.type
    })
    setUpdateModel(true);
    handleModelModalShow();
  }

  //Mostrar Modal Delete Model
  const showDeleteModel = (e, modelId) => {
    setIdDeleteModel(modelId);
    handleDeleteModalShow();
  }

  //Crear/Actualizar Modelo
  const createUpdateModel = () => {
    if(updateModel){
      
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName: modelFormValues.modelName, type:modelFormValues.type})
      };

      const request_url = host_url + `/admin/api/v1/device-models/update/${modelFormValues.modelId}`;

      fetch(request_url, requestOptions)
        .then((response) =>response.json())
        .then((update_model)=> {
          var nextModelList = modelList.map((model)=>{
            if(model.modelId === modelFormValues.modelId){
              model.modelName = update_model.modelName;
              model.type = update_model.type; 
            }
            return model;
          })
          setModelList(nextModelList);
          //Limpiar Formulario
          setModelFormValues({
            modelId: 0,
            modelName:"",
            type:"SENSOR"
          })
        });
      
      
      setUpdateModel(false);
    } else {

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName: modelFormValues.modelName, type:modelFormValues.type, userId: user.userId})
      };

      const request_url = host_url + "/admin/api/v1/device-models/new";
      
      fetch(request_url, requestOptions)
          .then((response) =>response.json())
          .then((new_model)=> {
            setModelList(modelList => [...modelList,new_model]);
          });
        
      //Limpiar Formulario
      setModelFormValues({
        modelId: 0,
        modelName:"",
        type:"SENSOR"
      })
    }
    handleModelModalClose();
  }

  //Solicitud de eliminación de modelo
  const deleteModel = () => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };

    const request_url = host_url + `/admin/api/v1/device-models/delete/${idDeleteModel}`;

    //Send Delete App Request
    fetch(request_url, requestOptions)
      .then(() => {
        setModelList(modelList.filter(model =>
          model.modelId !== idDeleteModel
        ));
        setIdDeleteModel(0);
        //cerrar modal
        handledDeleteModalClose();
      });
  }

  //Handle formulario Modelo
  const handleModelValores = (e) =>{
    setModelFormValues({
      ...modelFormValues,
      [e.target.name]: e.target.value
    })
  }


  return (
    <div>
      <Modal show={showModelModal} onHide={handleModelModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Modelo</Modal.Title>
          </Modal.Header>
        <Modal.Body>
            <form onSubmit={createUpdateModel}>
              <label htmlFor='modelName' className='form-label fw-semibold'>Nombre del Modelo:</label><br />
              <input 
                type='text' 
                className='form-control'
                name='modelName'
                id='modelName'
                required={true}
                value={modelFormValues.modelName}
                onChange={handleModelValores}
              ></input>
              <label htmlFor='type' className='form-label fw-semibold'>Tipo de Dispositivo:</label><br />
              <select 
                type='text' 
                className='form-select'
                name='type'
                id="type"
                required={true}
                value={modelFormValues.type}
                onChange={handleModelValores}
              >
                <option value="SENSOR">SENSOR</option>
                <option value="ACTUATOR">ACTUATOR</option>
                <option value="GATEWAY">GATEWAY</option>
              </select>
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModelModalClose}>
            Cancelar
          </Button>
          <Button variant="success" onClick={createUpdateModel}>
              Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={deleteModelModal} onHide={handledDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Modelo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro de eliminar este Modelo?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handledDeleteModalClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteModel}>
            Borrar
          </Button>
        </Modal.Footer>
      </Modal>
      <TitleComponent title="Modelos"/>    
      <div className='card shadow-sm p-3 mb-5 bg-body rounded'>
          <div className='card-body'>
              <h5 className='card-title fw-semibold mb-4'>Gestión de Modelos</h5>
              <hr/>
              <button className="btn btn-success" onClick={showCreateModel}><i className="bi bi-window"></i><span className="ms-2">Crear Modelo</span></button>
              <br/><br/>              
              <p className='mb-0'>Tus modelos</p>
              <br/>
              <ModelsTableComponent modelList={modelList} showUpdateModel={showUpdateModel} showDeleteModel={showDeleteModel} />
          </div>
      </div>
    </div>
  )
}

export default ModelsComponent