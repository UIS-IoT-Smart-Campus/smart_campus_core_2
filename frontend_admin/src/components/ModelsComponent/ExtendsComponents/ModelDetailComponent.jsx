import { useParams } from "react-router-dom"
import TitleComponent from "../../SingleComponents/TitleComponent/TitleComponent"
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";


function ModelDetailComponent () {

    //Obtener host URL de variables de entorno
    const host_url = process.env.REACT_APP_HOST_URL;

    const [showPropertyModelModal, setShowPropertyModelModal] = useState(false);
    const [deletePropertyModelModal, setDeletePropertyModelModal] = useState(false);
    const [deletePropertyModelId, setDeletePropertyModelId] = useState(0);

    const pModelId = useParams().modelId;
    const [model, setModel] = useState({
        modelId: pModelId,
        modelName: "",
        creationDate: "",
        type: "SENSOR",
        modelProperties: []
    });

    const handleShowPropertyModal = () => setShowPropertyModelModal(true);
    const handleClosePropertyModal = () => setShowPropertyModelModal(false);
    const handleShowDeletePropertyModal = () => setDeletePropertyModelModal(true);
    const handleCloseDeletePropertyModal = () => setDeletePropertyModelModal(false);

    //Variable para controlar valores del formulario
    const [propertyModelFormValues, setPropertyModelFormValues] = useState({
        modelPropertyId:0,
        name:"",
        value:""
    });
    
    useEffect(()=>{

        const request_url = host_url +`/admin/api/v1/device-models/${pModelId}`;

        fetch(request_url)
            .then((response)=>{
                return response.json()
            })
            .then((res)=>{
                res.creationDate = new Date(res.creationDate).toLocaleString("es-CO").replace(',' ,'');
                setModel(res)
            })
    },[pModelId,host_url])

    const showDeletePropertyModal = (e, propertyId) => {
        setDeletePropertyModelId(propertyId);
        handleShowDeletePropertyModal();
    }

    const createPropertyModel = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: propertyModelFormValues.name, value:propertyModelFormValues.value})
        };

        const request_url = host_url +`/admin/api/v1/device-models/add-property/${pModelId}`;

        fetch(request_url, requestOptions)
        .then((response) =>response.json())
        .then((res)=> {
            setModel(res);
            //Limpiar Formulario
            setPropertyModelFormValues({
                modelPropertyId: 0,
                name:"",
                value:""
            })

            handleClosePropertyModal();
        });
    }

    const deletePropertyModel = () =>{
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };

        const request_url = host_url +`/admin/api/v1/device-models/delete-property/${deletePropertyModelId}`;

        //Send Delete App Request
        fetch(request_url, requestOptions)
            .then(() => {
                let temModelProperties = model.modelProperties.filter(property => property.modelPropertyId !== deletePropertyModelId);
                model.modelProperties = temModelProperties;
                setDeletePropertyModelId(0);
                //cerrar modal
                handleCloseDeletePropertyModal();
            });         
    }

    //Handle formulario App
    const handlePropertyModelValores = (e) =>{
        setPropertyModelFormValues({
        ...propertyModelFormValues,
        [e.target.name]: e.target.value
        })
    }



  return (
    <div>
        <Modal show={showPropertyModelModal} onHide={handleClosePropertyModal}>
            <Modal.Header closeButton>
            <Modal.Title>Crear Propiedad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={createPropertyModel}>
                <label htmlFor='name' className='form-label fw-semibold'>Nombre de la Propiedad:</label><br />
                <input 
                    type='text' 
                    className='form-control'
                    name='name'
                    id='name'
                    required={true}
                    value={propertyModelFormValues.name}
                    onChange={handlePropertyModelValores}
                ></input>
                <label htmlFor='value' className='form-label fw-semibold'>Valor de la Propiedad:</label><br />
                <input 
                    type='text' 
                    className='form-control'
                    name='value'
                    id='value'
                    required={true}
                    value={propertyModelFormValues.value}
                    onChange={handlePropertyModelValores}
                ></input>
                </form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePropertyModal}>
                Cancelar
            </Button>
            <Button variant="success" onClick={createPropertyModel}>
                Guardar
            </Button>
            </Modal.Footer>
        </Modal>
        <Modal show={deletePropertyModelModal} onHide={handleCloseDeletePropertyModal}>
            <Modal.Header closeButton>
            <Modal.Title>Eliminar Propiedad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Está seguro de eliminar esta propiedad?</p>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeletePropertyModal}>
                Cancelar
            </Button>
            <Button variant="danger" onClick={deletePropertyModel}>
                Borrar
            </Button>
            </Modal.Footer>
        </Modal>
        <TitleComponent title={model.modelName}/>   
        <div className='card shadow-sm p-3 mb-5 bg-body rounded'>
            <div className='card-body'>
                <h4 className='card-title fw-semibold mb-4'>Modelo</h4>                
                <p className='mb-0'>Información del Modelo</p>
                <table className="table">
                    <tbody>
                        <tr>
                            <td><b>Nombre:</b></td>
                            <td>{model.modelName}</td>
                            <td><b>Fecha Creación:</b></td>
                            <td>{model.creationDate}</td>
                            <td><b>Tipo:</b></td>
                            <td>{model.type}</td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <h4 className="fw-semibold mb-4">Propiedades</h4>
                <button className="btn btn-success mb-4" onClick={handleShowPropertyModal}><i className="bi bi-plus-circle"></i><span className="ms-2">Agregar Propiedad</span></button>
                <p>Propiedades del Modelo</p>
                <table className="table table-hover table-bordered text-center">
                    <thead className="table-secondary">
                        <tr>
                            <th scope="col">Propiedad</th>
                            <th scope="col">Valor</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            model.modelProperties &&
                            model.modelProperties.map((property)=>{
                                return (
                                    <tr key={property.modelPropertyId}>
                                        <td>{property.name}</td>
                                        <td>{property.value}</td>
                                        <td><button className="btn btn-sm btn-danger ms-2"  onClick={(e) => showDeletePropertyModal(e,property.modelPropertyId)}><i className="bi bi-trash"></i></button></td>
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

export default ModelDetailComponent