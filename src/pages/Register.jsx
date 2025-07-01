import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);


    const handleLogin = () => {
     
      navigate("/login");
    };
  return (
    <div className="container mt-5" role="main" aria-label="Page d'inscription">
      <h1 className="text-center" tabIndex="0">Inscription</h1>
      <form className="mt-4" aria-label="Formulaire d'inscription">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
          <input
            type="text"
            className="form-control"
            id="username"
            aria-required="true"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-required="true"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            aria-required="true"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          onClick={handleLogin}
          aria-label="S'inscrire"
        >
           {loading ? "inscription en cours..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}