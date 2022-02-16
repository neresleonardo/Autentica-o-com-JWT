import { useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { useCan } from "../../hooks/useCan"
import { setupAPIClient } from "../../services/api"
import { api } from "../../services/apiClient"
import { Can } from "../components/Can"

import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard(){
    
    const { user } = useContext(AuthContext)



    useEffect(() => {
        api.get('/me')
        .then(response => console.log(response))
        .catch(err => console.error(err))
    }, [])

    return(
        <>
        <h1>Seu email é : {user?.email}</h1>

      <Can permissions={['metrics.list']}>
       <div>Métricas</div> 
      </Can>
        </>
    )
}

export const getServerSideProps = withSSRAuth(async(ctx) => {

    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/me');

    

    return {
        props: {}
    }
})
