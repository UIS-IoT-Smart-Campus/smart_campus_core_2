import { useContext, useEffect, useState } from "react"
import TitleComponent from "../SingleComponents/TitleComponent/TitleComponent"
import CardComponent from "./InternalComponents/CardComponent"
import TableComponent from "./InternalComponents/TableServiceComponent"
import { UserContext } from "../../context/UserContext";

function HomeComponent() {
  //obtener usuario de localStorage
  const {user} = useContext(UserContext);

  //Obtener host URL de variables de entorno
  const host_url = process.env.REACT_APP_HOST_URL;

  const [totalDevice, setTotalDevice] = useState(0);
  const [totalModel, setTotalModel] = useState(0);
  const [totalApp, setTotalApp] = useState(0);

  useEffect(()=>{

    const request_url = host_url + `/admin/api/v1/status/stats/${user.userId}`;

    fetch(request_url)
      .then((response)=>response.json())
      .then((statsResponse)=>{
        setTotalDevice(statsResponse.totalDevices);
        setTotalModel(statsResponse.totalModels);
        setTotalApp(statsResponse.totalApps);
      })
  })

  const items = [
    {
      "id":1,
      "name":"Gateway",
      "img":"https://toppng.com/uploads/preview/free-icons-png-green-button-icon-11562980484agrqdnwooe.png",
      "last_update":"14/03/2024 11:00:00"
    },
    {
      "id":2,
      "name":"Admin-Service",
      "img":"https://toppng.com/uploads/preview/free-icons-png-green-button-icon-11562980484agrqdnwooe.png",
      "last_update":"14/03/2024 11:00:00"
    },
    {
      "id":3,
      "name":"Data-Service",
      "img":"https://toppng.com/uploads/preview/free-icons-png-green-button-icon-11562980484agrqdnwooe.png",
      "last_update":"14/03/2024 11:00:00"
    }
  ]

  return (
    <div>
      <TitleComponent title="Resumen"/>
      <div className="row justify-content-between px-4">
        <CardComponent title="DISPOSITIVOS" value={totalDevice} />
        <CardComponent title="APLICACIONES"  value={totalApp} />
        <CardComponent title="MODELOS" value={totalModel} />
      </div>
      <div className='card shadow-sm p-2 mb-5 bg-body rounded'>
        <div className='card-body'>
            <h5 className='card-title fw-semibold fs-3 mb-4'>Estado de los Servicios</h5>
            <TableComponent items={items} />
        </div>
      </div>
    </div>
  )
}

export default HomeComponent