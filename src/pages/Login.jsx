import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isConnected, error, loading } = useSelector((state) => state.auth);

  const [connectForm, setConnectForm] = useState({
    identifiant: "",
    password: "",
  });
  useEffect(() => {
    if (isConnected) {
      if (
        connectForm.identifiant === "admin" &&
        connectForm.password === "admin"
      ) {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    }
  }, [isConnected, navigate, connectForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(connectForm));
  };

  return (
    <>
      <div className="container mt-5" role="main" aria-label="Page de connexion administrateur">
        <h1 className="text-center" tabIndex="0">Connexion</h1>
        {error && (
          <p className="text-danger text-center" aria-live="assertive" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-4" aria-label="Formulaire de connexion">
          <div className="mb-3">
            <label htmlFor="identifiant">Identifiant</label>
            <input
              type="text"
              className="form-control"
              id="identifiant"
              aria-label="Identifiant"
              aria-required="true"
              onChange={(e) => {
                setConnectForm({ ...connectForm, identifiant: e.target.value });
              }}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="password"
              aria-label="Mot de passe"
              aria-required="true"
              onChange={(e) => {
                setConnectForm({ ...connectForm, password: e.target.value });
              }}
              required
            />
          </div>
          <p className="text-center">
            <NavLink className="dropdown-item" to="/dashboard">
              Première connexion ?
            </NavLink>
          </p>
          <p className="text-center">
            <NavLink className="dropdown-item" to="/register">
              Mot de passe oublié ?
            </NavLink>
          </p>
          <button
            className="btn btn-primary w-100"
            type="submit"
            aria-label="Se connecter"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </>
  );
}