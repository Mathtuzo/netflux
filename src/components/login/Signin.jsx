import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import '../login/login.css'

function Signin() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [users, setUsers] = useState([])
    const [successMessage, setSuccessMessage] = useState("")

    const navigate = useNavigate()
    
    useEffect(() => {
        const storedUsers = localStorage.getItem("users")
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers))
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!email || !password) {
            setSuccessMessage("Veuillez remplir tous les champs.")
            return
        }

        const newUser = { name, email, password }
        

        const updatedUsers = [...users, newUser]
        setUsers(updatedUsers)

       
        localStorage.setItem("users", JSON.stringify(updatedUsers))

        setSuccessMessage("Inscription réussie !")
        setName("")
        setEmail("")
        setPassword("")
    };

    const logInClicked = ()=>{
    navigate("/login")
  }

  console.log(users);
  

    return (
        <div className="main-content">
            <h1>Nom de l'application</h1>
            <div id="log-form">
                <h2 id="form-title">Inscription</h2>
                <form onSubmit={handleSubmit} className="loginform">
                    <label htmlFor="name">Nom :</label>
                    <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)}/>
                    <label htmlFor="email">E-mail :</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <label htmlFor="password">Mot de passe :</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit" id="submit">S'inscrire</button>
                </form>
                <button id="btn-form" onClick={logInClicked}>Se connecter</button>
                {successMessage && <div className="message">{successMessage}</div>}
            </div>
        </div>
    );
}

export default Signin