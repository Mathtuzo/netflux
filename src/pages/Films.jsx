import { useState } from "react";
import { Link } from "react-router-dom";
import catalogueData from './catalogue.json';

export default function Films() {
  const films = catalogueData.catalogue.filter(catalogue => catalogue.type === 'film');
  const [index, setIndex] = useState(0);

  const getVisibleFilms = () => {
    const visible = [];
    for (let i = 0; i < 5; i++) {
      visible.push(films[(index + i) % films.length]);
    }
    return visible;
  };

  const prevFilm = () => setIndex(index === 0 ? films.length - 1 : index - 1);
  const nextFilm = () => setIndex((index + 1) % films.length);

  return (
    <div className="container mt-5 text-center" role="main" aria-label="Section catalogue films">
      <h1 tabIndex="0">Mes Films</h1>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <button
          className="btn btn-secondary mx-2"
          onClick={prevFilm}
          aria-label="Afficher les films précédents"
        >
          Précédent
        </button>
        <div className="d-flex" role="list" aria-label="Liste des films affichés">
          {getVisibleFilms().map((film) => (
            <div key={film.id} className="mx-2" role="listitem">
              <Link to={`/films/${encodeURIComponent(film.titre)}`}>
                <img
                  src={film.affiche}
                  alt={`Affiche du film ${film.titre}`}
                  className="img-fluid rounded"
                  style={{ width: "200px", height: "300px", objectFit: "cover" }}
                />
                <p>{film.titre}</p>
              </Link>
            </div>
          ))}
        </div>
        <button
          className="btn btn-secondary mx-2"
          onClick={nextFilm}
          aria-label="Afficher les films suivants"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}