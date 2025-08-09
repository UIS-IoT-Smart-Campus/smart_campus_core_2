import { Link } from "react-router-dom";

function ModelsTableComponent({modelList, showUpdateModel, showDeleteModel}) {

    return (
        <div>        
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
                        modelList.length > 0 &&
                        modelList.map((model)=>{
                            let d = new Date(model.creationDate).toLocaleString("es-CO").replace(',' ,'');
                            return(
                                <tr key={model.modelId}>
                                    <td>{model.modelName}</td>
                                    <td>{d}</td>
                                    <td>{model.type}</td>
                                    <td>
                                        <Link className="btn btn-sm btn-success ms-2" to={"/model/detail/"+model.modelId}><i className="bi bi-eye"></i></Link>
                                        <button className="btn btn-sm btn btn-primary ms-2" onClick={(e) => showUpdateModel(e,model)}><i className="bi bi-pencil-fill"></i></button>
                                        <button className="btn btn-sm btn-danger ms-2" onClick={(e) => showDeleteModel(e,model.modelId)}><i className="bi bi-trash"></i></button>                                    
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

export default ModelsTableComponent