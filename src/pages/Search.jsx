import { useState } from "react";
import { Link } from "react-router-dom";
import catalogueData from './catalogue.json';

export default function Search() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tous");

  // Récupérer tous les genres uniques du catalogue
  const allGenres = [
    ...new Set(
      catalogueData.catalogue.flatMap(item => item.genre)
    ),
  ];

  // Filtrer et trier par ordre alphabétique + genre
  const filteredCatalogue = catalogueData.catalogue
    .filter(item =>
      item.titre.toLowerCase().includes(search.toLowerCase()) &&
      (selectedGenre === "Tous" || item.genre.includes(selectedGenre))
    )
    .sort((a, b) => a.titre.localeCompare(b.titre));

  return (
    <div
      className="container mt-5 text-center"
      role="main"
      aria-label="Recherche dans le catalogue"
    >
      <h2 className="mt-5" tabIndex="0">Recherche</h2>
      <input
        type="text"
        placeholder="Rechercher par titre..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="form-control mb-4"
        style={{ maxWidth: 400, margin: "0 auto" }}
        aria-label="Rechercher un titre dans le catalogue"
        aria-describedby="search-help"
      />

      <div className="mb-4" role="group" aria-label="Filtrer par genre">
        <button
          role="button"
          className={`btn btn-outline-primary mx-1 ${selectedGenre === "Tous" ? "active" : ""}`}
          onClick={() => setSelectedGenre("Tous")}
          aria-pressed={selectedGenre === "Tous"}
          aria-label="Afficher tous les genres"
        >
          Tous
        </button>
        {allGenres.map((genre) => (
          <button
            role="button"
            key={genre}
            className={`btn btn-outline-primary mx-1 ${selectedGenre === genre ? "active" : ""}`}
            onClick={() => setSelectedGenre(genre)}
            aria-pressed={selectedGenre === genre}
            aria-label={`Filtrer par genre ${genre}`}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="d-flex flex-wrap justify-content-center" role="list" aria-label="Résultats de la recherche">
        {filteredCatalogue.map((item) => (
          <div key={item.id} className="m-3" role="listitem">
            <Link to={`/${item.type === "film" ? "films" : "series"}/${encodeURIComponent(item.titre)}`}>
              <img
                src={item.affiche}
                alt={`Affiche de ${item.titre}`}
                style={{ width: "200px", height: "300px", objectFit: "cover", borderRadius: "10px" }}
              />
              <p>{item.titre}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}