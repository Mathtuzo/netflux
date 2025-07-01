import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import Home from"./Home";

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stats = {
    visiteurs: 35,
    sessions: 15,
    inscrits: 15,
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

 return (
    <main className="container mt-5" role="main" aria-label="Tableau de bord administrateur">
      <header className="admin-header" role="banner">
        <h1 tabIndex="0">Tableau de bord administrateur</h1>
        <p className="welcome-message">
          Bienvenue, <span aria-live="polite">{user?.name || user?.identifiant || "Administrateur"}</span>
        </p>
      </header>

      <section className="dashboard-stats" aria-label="Statistiques du site">
        <table className="table table-bordered mt-4" aria-describedby="Statistiques principales">
          <thead>
            <tr>
              <th scope="col">Nombre de visiteurs</th>
              <th scope="col">Sessions connectées</th>
              <th scope="col">Nombre d'inscrits</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{stats.visiteurs}</td>
              <td>{stats.sessions}</td>
              <td>{stats.inscrits}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <Home />

      <button
        className="logout-button"
        onClick={handleLogout}
        aria-label="Se déconnecter du tableau de bord administrateur"
      >
        Se déconnecter
      </button>
    </main>
  );
}