function TableServiceComponent({items}) {
    
  return (
    <div>
        <table className="table table-hover text-center">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Servicio</th>     
                    <th scope="col">Estado</th>     
                    <th scope="col">Ultima Actualización</th>                   
                </tr>
            </thead>
            <tbody>
                {
                    items.length > 0 &&
                    items.map((item)=>{
                        return(
                            <tr key={item.id}>
                                <th scope="row">{item.id}</th>
                                <td>{item.name}</td>
                                <td><img src={item.img} height="20px" title="Active" alt="Active"/></td>
                                <td>{item.last_update}</td>
                            </tr>
                        )
                    })
                }                
            </tbody>
        </table>
    </div>
  )
}

export default TableServiceComponent