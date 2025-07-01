import '../login/login.css'

import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {
    
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || []

    const userExists = storedUsers.some(
      (user) => user.email === email && user.password === password
    )

    const user = storedUsers.find(
      (user) => user.email === email && user.password === password
    )

    if (user) {
      localStorage.setItem("connectedUser", JSON.stringify(user))
      setErrorMessage("")
      navigate("/home")
    }

    if (userExists) {
      setErrorMessage("")
      navigate("/home")
    } else {
      setErrorMessage("E-mail ou mot de passe incorrect !");
    }
  };

  const signInClicked = ()=>{
    navigate("/subscribe")
  }

  

  return (
    <div className='main-content'>
      <h1>Netflux</h1>
      <div id="log-form">
        <h2 id="form-title">Connexion</h2>
        <form className="loginform" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <label htmlFor="password">Mot de passe</label>
          <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          {errorMessage && <div className="error">{errorMessage}</div>}
          <button type="submit" id="submit">Se Connecter</button>
          <a href="#" id="btn-mdp">Mot de passe oublié</a>
          <button id="btn-form" onClick={signInClicked}>S'inscrire</button>
        </form>
      </div>
    </div>
      
  );
}

export default Login
