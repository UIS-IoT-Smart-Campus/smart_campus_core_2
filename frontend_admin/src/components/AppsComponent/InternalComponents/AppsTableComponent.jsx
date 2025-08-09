import { Link } from "react-router-dom";

function AppsTableComponent({appList, showUpdateApp, showDeleteApp}) {    
    

  return (
    <div>
        
        <table className="table table-hover table-bordered text-center">
            <thead className="table-secondary">
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Fecha Creación</th>
                    <th scope="col">Dispositivos</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
            {
                    appList.length > 0 &&
                    appList.map((app)=>{
                        let d = new Date(app.creationDate).toLocaleString("es-CO").replace(',' ,'');
                        return(
                            <tr key={app.appId}>
                                <td>{app.appName}</td>
                                <td>{d}</td>
                                <td>
                                    {app.appDevices ? app.appDevices.length:0}
                                </td>
                                <td>
                                    <Link className="btn btn-sm btn-success ms-2" to={"/app/detail/"+app.appId}><i className="bi bi-eye"></i></Link>
                                    <button className="btn btn-sm btn btn-primary ms-2" onClick={(e) => showUpdateApp(e,app)}><i className="bi bi-pencil-fill"></i></button>
                                    <button className="btn btn-sm btn-danger ms-2" onClick={(e) => showDeleteApp(e,app.appId)}><i className="bi bi-trash"></i></button>                                    
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

export default AppsTableComponent