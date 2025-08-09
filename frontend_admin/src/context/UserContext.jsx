import { createContext, useEffect, useState } from "react";


export const UserContext = createContext();

const userInicial = JSON.parse(localStorage.getItem("user")) || null;

export const UserProvider = ({children}) => {

    const [user,setUser] = useState(userInicial);


    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(user))
    },[user])


    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
    

}