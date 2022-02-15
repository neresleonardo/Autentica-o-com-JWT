import { useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { api } from "../../services/api"

export default function Dashboard(){
    
    const { user } = useContext(AuthContext)

    useEffect(() => {
        api.get('/me')
        .then(response => console.log(response))
        .catch(err => console.error(err))
    }, [])

    return(
        <h1>Seu email é : {user?.email}</h1>
    )
}
