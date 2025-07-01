import { useParams, Link } from "react-router-dom";
import catalogueData from './catalogue.json';

export default function FilmsDetails() {
  const { filmsId } = useParams();
  const film = catalogueData.catalogue.find(
    (item) => item.titre === decodeURIComponent(filmsId) && item.type === 'film'
  );

  if (!film) {
    return (
      <main className="container mt-5 text-center" role="main" aria-label="Détail du film">
        <h1 tabIndex="0">Film introuvable</h1>
        <Link to="/films" className="btn btn-primary mt-3" aria-label="Retour au catalogue des films">
          Retour au catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="container mt-5" role="main" aria-label={`Détail du film ${film.titre}`}>
      <header>
        <h1 tabIndex="0">{film.titre}</h1>
      </header>
      <img
        src={film.affiche}
        alt={`Affiche du film ${film.titre}`}
        className="img-fluid rounded mb-3"
        style={{ maxWidth: '300px' }}
      />
      <p><strong>Année :</strong> {film.annee}</p>
      <p><strong>Durée :</strong> {film.duree} minutes</p>
      <p><strong>Genres :</strong> {Array.isArray(film.genre) ? film.genre.join(', ') : film.genre}</p>
      <p><strong>Description :</strong> {film.description || film.synopsis}</p>
      <Link to="/films" className="btn btn-primary mt-3" aria-label="Retour au catalogue des films">
        Retour au catalogue
      </Link>
    </main>
  );
}