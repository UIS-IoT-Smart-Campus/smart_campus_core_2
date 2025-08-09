import { Link } from "react-router-dom";


function DeviceTableComponent({deviceList, showUpdateDevice, showDeleteDevice}) {

  return (
    <div>
      <table className="table table-hover table-bordered text-center">
        <thead className="table-secondary">
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Fecha Creación</th>
            <th scope="col">Modelo</th>
            <th scope="col">Tipo</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            deviceList &&
            deviceList.map((device) =>{
              let d = new Date(device.creationDate).toLocaleString("es-CO").replace(',' ,'');
              return (
                <tr key={device.deviceId}>
                  <td>{device.deviceName}</td>
                  <td>{d}</td>
                  <td>{device.model.modelName}</td>
                  <td>{device.model.type}</td>
                  <td>
                    <Link className="btn btn-sm btn-success ms-2" to={"/device/detail/" + device.deviceId}><i className="bi bi-eye"></i></Link>
                    <button className="btn btn-sm btn btn-primary ms-2" onClick={(e) => showUpdateDevice(e, device)}><i className="bi bi-pencil-fill"></i></button>
                    <button className="btn btn-sm btn-danger ms-2" onClick={(e) => showDeleteDevice(e, device.deviceId)}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              )
            })

          }
        </tbody>
      </table>
    </div>
  )
}

export default DeviceTableComponent