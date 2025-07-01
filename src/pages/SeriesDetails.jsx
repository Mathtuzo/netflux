import { useParams, Link } from "react-router-dom";
import catalogueData from './catalogue.json';

export default function SeriesDetails() {
  const { seriesId } = useParams();
  const serie = catalogueData.catalogue.find(
    (item) => item.titre === decodeURIComponent(seriesId) && item.type === 'serie'
  );

  if (!serie) {
    return (
      <main className="container mt-5 text-center" role="main" aria-label="Détail de la série">
        <h1 tabIndex="0">Série introuvable</h1>
        <Link to="/series" className="btn btn-primary mt-3" aria-label="Retour au catalogue des séries">
          Retour aux catalogues
        </Link>
      </main>
    );
  }

  return (
    <main className="container mt-5" role="main" aria-label={`Détail de la série ${serie.titre}`}>
      <header>
        <h1 tabIndex="0">{serie.titre}</h1>
      </header>
      <img
        src={serie.affiche}
        alt={`Affiche de la série ${serie.titre}`}
        className="img-fluid rounded mb-3"
        style={{ maxWidth: '300px' }}
      />
      <p><strong>Saison :</strong> {serie.saisons}</p>
      <p><strong>Année :</strong> {serie.annee}</p>
      <p><strong>Durée :</strong> {serie.duree} minutes</p>
      <p><strong>Genres :</strong> {serie.genre.join(', ')}</p>
      <p><strong>Description :</strong> {serie.description}</p>
      <Link to="/series" className="btn btn-primary mt-3" aria-label="Retour au catalogue des séries">
        Retour aux catalogues
      </Link>
    </main>
  );
}