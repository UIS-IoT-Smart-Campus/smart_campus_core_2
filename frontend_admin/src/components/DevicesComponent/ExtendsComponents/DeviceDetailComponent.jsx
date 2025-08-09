import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TitleComponent from "../../SingleComponents/TitleComponent/TitleComponent";
import { Button, Modal } from "react-bootstrap";


function DeviceDetailComponent() {

    //Obtener host URL de variables de entorno
    const host_url = process.env.REACT_APP_HOST_URL;

    const [showPropertyDeviceModal, setShowPropertyDeviceModal] = useState(false);
    const [deletePropertyDeviceModal, setDeletePropertyDeviceModal] = useState(false);
    const [deletePropertyDeviceId, setDeletePropertyDeviceId] = useState(0);

    const pDeviceId = useParams().deviceId;

    const handleShowPropertyModal = () => setShowPropertyDeviceModal(true);
    const handleClosePropertyModal = () => setShowPropertyDeviceModal(false);
    const handleShowDeletePropertyModal = () => setDeletePropertyDeviceModal(true);
    const handleCloseDeletePropertyModal = () => setDeletePropertyDeviceModal(false);

    const [device, setDevice] = useState({
        deviceId: pDeviceId,
        deviceName: "",
        creationDate: "",
        model: {},
        deviceProperties: []
    });

    //Variable para controlar valores del formulario
    const [propertyDeviceFormValues, setPropertyDeviceFormValues] = useState({
        devicePropertyId: 0,
        name: "",
        value: ""
    });

    useEffect(() => {

        const request_url = host_url + `/admin/api/v1/devices/${pDeviceId}`;

        fetch(request_url)
            .then((response) => {
                return response.json()
            })
            .then((res) => {
                res.creationDate = new Date(res.creationDate).toLocaleString("es-CO").replace(',', '');
                setDevice(res)
            })
    }, [pDeviceId, host_url])

    const showDeletePropertyModal = (e, propertyId) => {
        setDeletePropertyDeviceId(propertyId);
        handleShowDeletePropertyModal();
    }

    const createPropertyDevice = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: propertyDeviceFormValues.name, value: propertyDeviceFormValues.value })
        };

        const request_url = host_url + `/admin/api/v1/devices/add-property/${pDeviceId}`;

        fetch(request_url, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                setDevice(res);
                //Limpiar Formulario
                setPropertyDeviceFormValues({
                    devicePropertyId: 0,
                    name: "",
                    value: ""
                })

                handleClosePropertyModal();
            });
    }

    const deletePropertyDevice = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };

        const request_url = host_url + `/admin/api/v1/devices/delete-property/${deletePropertyDeviceId}`;

        //Send Delete App Request
        fetch(request_url, requestOptions)
            .then(() => {
                let temDeviceProperties = device.deviceProperties.filter(property => property.devicePropertyId !== deletePropertyDeviceId);
                device.deviceProperties = temDeviceProperties;
                setDeletePropertyDeviceId(0);
                //cerrar modal
                handleCloseDeletePropertyModal();
            });
    }

    //Handle formulario App
    const handlePropertyDeviceValores = (e) => {
        setPropertyDeviceFormValues({
            ...propertyDeviceFormValues,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div>
            <Modal show={showPropertyDeviceModal} onHide={handleClosePropertyModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Propiedad</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={createPropertyDevice}>
                        <label htmlFor='name' className='form-label fw-semibold'>Nombre de la Propiedad:</label><br />
                        <input
                            type='text'
                            className='form-control'
                            name='name'
                            id='name'
                            required={true}
                            value={propertyDeviceFormValues.name}
                            onChange={handlePropertyDeviceValores}
                        ></input>
                        <label htmlFor='value' className='form-label fw-semibold'>Valor de la Propiedad:</label><br />
                        <input
                            type='text'
                            className='form-control'
                            name='value'
                            id='value'
                            required={true}
                            value={propertyDeviceFormValues.value}
                            onChange={handlePropertyDeviceValores}
                        ></input>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePropertyModal}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={createPropertyDevice}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={deletePropertyDeviceModal} onHide={handleCloseDeletePropertyModal}>
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
                    <Button variant="danger" onClick={deletePropertyDevice}>
                        Borrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <TitleComponent title={device.deviceName} />
            <div className='card shadow-sm p-3 mb-5 bg-body rounded'>
                <div className='card-body'>
                    <h4 className='card-title fw-semibold mb-4'>Dispositivo</h4>
                    <p className='mb-0'>Información del Dispositivo</p>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td><b>Nombre:</b></td>
                                <td>{device.deviceName}</td>
                                <td><b>Fecha Creación:</b></td>
                                <td>{device.creationDate}</td>
                                <td><b>Modelo:</b></td>
                                <td>{device.model.modelName}</td>
                                <td><b>Tipo:</b></td>
                                <td>{device.model.type}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <p>URL datos del dispositivo: <Link to={"http://localhost:8080/data/device?uuid=" + device.deviceId} target="_blank">DEVICE DATA</Link></p>
                    <br />
                    <h4 className="fw-semibold mb-4">Propiedades</h4>
                    <button className="btn btn-success mb-4" onClick={handleShowPropertyModal}><i className="bi bi-plus-circle"></i><span className="ms-2">Agregar Propiedad</span></button>
                    <p>Propiedades del Dispositivo</p>
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
                                device.deviceProperties &&
                                device.deviceProperties.map((property) => {
                                    return (
                                        <tr key={property.devicePropertyId}>
                                            <td>{property.name}</td>
                                            <td>{property.value}</td>
                                            <td><button className="btn btn-sm btn-danger ms-2" onClick={(e) => showDeletePropertyModal(e, property.devicePropertyId)}><i className="bi bi-trash"></i></button></td>
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

export default DeviceDetailComponent