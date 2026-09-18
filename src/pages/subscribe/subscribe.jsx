import Subscribe from "../../components/abonnements/subs"
import { useNavigate } from "react-router-dom"



function SubscribePage(){

    const navigate = useNavigate()

    const logInClicked = ()=>{
        navigate("/login")
    }

    return(
        <div className="main-content">
            <h1>Abonnements</h1>
            <Subscribe/>
            <button id="btn-form" onClick={logInClicked}>Se connecter</button>
        </div>
            
            
        
    )
}

export default SubscribePage