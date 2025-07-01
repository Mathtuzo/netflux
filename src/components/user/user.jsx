import { useState, useEffect } from 'react'
import user from '../../assets/svg/user.svg'
import "../user/user.css"
import { Link, useNavigate} from 'react-router-dom'

function User(){

    const navigate = useNavigate()

    const userLinks = [
        // {title: "Profil", path: "/user"},
        // {title: "Paramètres", path: "/settings"},
        {title: "Aide", path: "/help"}
    ]

    const [userName, setUserName] = useState("")
    const [userClicked, setUserClicked] = useState(false)

    useEffect(() => {
        const connectedUser = JSON.parse(localStorage.getItem("connectedUser"))
        if (connectedUser) {
            setUserName(connectedUser.name)
        }
    }, [])

    const handleClick = () =>{
        setUserClicked(prev => !prev)
    }

    const handleLinkClick = () => {
        setUserClicked(false)
    }

     const handleLogout = () => {
        localStorage.removeItem("connectedUser")
        navigate("/login")
    }

    return(
        <div id='nav-user'>
            <div id='user-btn' onClick={handleClick} style={userClicked ? {paddingRight: "0"} : {paddingRight: "43px"}}>
                <img src={user} alt="profil"/>
                <p>{userName}</p>
            </div>
            <div id='user-links' style={userClicked ? {display: "flex"} : {display: "none"}}>
                {userLinks.map((item, index)=>{
                    return(
                        <Link to={item.path} key={index} onClick={handleLinkClick}>{item.title}</Link>
                    )
                })}
                <p onClick={handleLogout}>Se déconnecter</p>
            </div>
            
        </div>
    )
}

export default User