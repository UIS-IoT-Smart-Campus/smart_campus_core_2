import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";


function RegisterComponent() {
    //obtener usuario de localStorage
    const {user, setUser} = useContext(UserContext);

    //Obtener host URL de variables de entorno
    const host_url = process.env.REACT_APP_HOST_URL;

    //Para manejar valores de formulario
    const [formRegisterValues, setFormRegisterValues] = useState({
        userName:"",
        userPassword:"",
        email:""
    });

    const register = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: formRegisterValues.userName, password: formRegisterValues.userPassword, email: formRegisterValues.email })
        };

        const request_url = host_url + "/admin/api/v1/user/new";

        fetch(request_url, requestOptions)
            .then((response) => response.json())
            .then((new_user) => {
                if (new_user.userId) {
                    setUser(new_user);
                } else {
                    console.log("No se pudo registrar");
                }
            })
    }

     //Handle formulario User
    const handleFormValues = (e) =>{
        setFormRegisterValues({
          ...formRegisterValues,
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
                <h3 className='card-title fw-semibold mb-3'>UIS IoT Registro</h3>
                <form onSubmit={register}>
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
                                    value={formRegisterValues.userName}
                                    onChange={handleFormValues}
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
                                    value={formRegisterValues.userPassword}
                                    onChange={handleFormValues}
                                    />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i className="bi bi-envelope"></i>
                                </span>
                                <input 
                                    className="form-control" 
                                    type="text" 
                                    placeholder="Correo Electrónico"
                                    name='email'
                                    required={true}
                                    value={formRegisterValues.email}
                                    onChange={handleFormValues}
                                />
                            </div>                          
                        </div>                                              
                    </div>
                </form>
                <div>
                    <Link to="/login" className="btn btn-light me-2">Volver</Link>
                    <button className="btn btn-success" onClick={register}>Registrarse</button>                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default RegisterComponent