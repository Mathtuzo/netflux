import { useState } from "react";
import { Link } from "react-router-dom";
import catalogueData from './catalogue.json';

export default function Series() {
  const series = catalogueData.catalogue.filter(catalogue => catalogue.type === 'serie');
  const [index, setIndex] = useState(0);

  const getVisibleSeries = () => {
    const visible = [];
    for (let i = 0; i < 5; i++) {
      visible.push(series[(index + i) % series.length]);
    }
    return visible;
  };

  const prevSerie = () => setIndex(index === 0 ? series.length - 1 : index - 1);
  const nextSerie = () => setIndex((index + 1) % series.length);

  return (
    <div className="container mt-5 text-center" role="main" aria-label="Section catalogue séries">
      <h1 tabIndex="0">Mes Séries</h1>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <button
          className="btn btn-secondary mx-2"
          onClick={prevSerie}
          aria-label="Afficher les séries précédentes"
        >
          Précédent
        </button>
        <div className="d-flex" role="list" aria-label="Liste des séries affichées">
          {getVisibleSeries().map((serie) => (
            <div key={serie.id} className="mx-2" role="listitem">
              <Link to={`/series/${encodeURIComponent(serie.titre)}`}>
                <img
                  src={serie.affiche}
                  alt={`Affiche de la série ${serie.titre}`}
                  className="img-fluid rounded"
                  style={{ width: "200px", height: "300px", objectFit: "cover" }}
                />
                <p>{serie.titre}</p>
              </Link>
            </div>
          ))}
        </div>
        <button
          className="btn btn-secondary mx-2"
          onClick={nextSerie}
          aria-label="Afficher les séries suivantes"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}