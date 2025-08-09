import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function LoginComponent() {

    //obtener usuario de localStorage
    const {user,setUser} = useContext(UserContext);

    //Obtener host URL de variables de entorno
    const host_url = process.env.REACT_APP_HOST_URL;

    //Para manejar valores de formulario
    const [formValues, setFormValues] = useState({
        userName:"",
        userPassword:""
    });

    const login = () =>{

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: formValues.userName, password: formValues.userPassword })
          };
        
        const request_url = host_url + "/admin/api/v1/user/validate";

        fetch(request_url, requestOptions)
            .then((resp) => {
                return resp.json();
            })
            .then((data)=>{
                if(data.userId){
                    setUser(data);
                } else {
                    setFormValues({
                        userName:"",
                        userPassword:""
                    })
                }
                
            })
    }

    //Handle formulario User
    const handleValores = (e) =>{
        setFormValues({
          ...formValues,
          [e.target.name]: e.target.value
        })
      }


  return (
    <div className="d-flex justify-content-center align-items-center h-100"> 
        {user && (
          <Navigate to="/" replace={true} />
        )}       
        <div className='card shadow-sm col-md-3 p-3 mb-5 bg-body rounded text-center'>
            <div className='card-body'>
                <h3 className='card-title fw-semibold mb-3'>UIS IoT Login</h3>
                <form onSubmit={login}>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i className="bi bi-person-circle"></i>
                                </span>
                                <input 
                                    className="form-control" 
                                    type="text" 
                                    placeholder="Nombre de Usuario"
                                    name='userName'
                                    required={true}
                                    value={formValues.userName}
                                    onChange={handleValores}
                                />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i className="bi bi-lock-fill"></i>
                                </span>
                                <input 
                                    className="form-control" 
                                    type="password"
                                    placeholder="Contraseña" 
                                    name='userPassword'
                                    required={true}
                                    value={formValues.userPassword}
                                    onChange={handleValores}
                                    />
                            </div>                            
                        </div>                                              
                    </div>
                </form>
                <div>
                    <button className="btn btn-primary me-2" onClick={login}>Ingresar</button>  
                    <Link to="/register" className="btn btn-success">Registrarse</Link>
                </div>
            </div>
        </div>
    </div>
    
  )
}

export default LoginComponent