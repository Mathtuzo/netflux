import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFilmsFromBdd } from '../../assets/ImportBDD';
import fallbackFilms from '../../assets/Filmlist';
import { searchFilms, getImageUrl, formatDuration, CANONICAL_GENRES, matchGenreFilter, isTypeMatch } from '../../assets/filmHelpers';
import Modal from '../../assets/Modal';
import './SearchPage.css';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'film', 'serie'
  const [selectedGenre, setSelectedGenre] = useState('Tous');
  // Initialisation synchrone avec le catalogue local : 0ms d'attente, aucun écran noir !
  const [films, setFilms] = useState(fallbackFilms);
  const [isLoading] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

  // Synchroniser la barre si l'URL change
  useEffect(() => {
    const qFromUrl = searchParams.get('q') || '';
    setQuery(qFromUrl);
  }, [searchParams]);

  // Rafraîchir en tâche de fond avec les données Firestore les plus récentes
  useEffect(() => {
    let isMounted = true;
    const loadFilms = async () => {
      try {
        const bdd = await getFilmsFromBdd(3500);
        if (isMounted && Array.isArray(bdd) && bdd.length > 0) {
          setFilms(bdd);
        }
      } catch (err) {
        console.warn('Utilisation du catalogue local de secours:', err?.message || err);
      }
    };
    loadFilms();
    return () => { isMounted = false; };
  }, []);

  // Extraire la liste des genres canoniques uniques présents dans le catalogue
  const availableGenres = useMemo(() => {
    if (!Array.isArray(films) || !films.length) return [];
    
    const items = [
      { id: 'tous', label: 'Tous', count: films.length }
    ];

    CANONICAL_GENRES.forEach(cg => {
      const count = films.filter(f => f && matchGenreFilter(f.genre, cg.label)).length;
      if (count > 0) {
        items.push({ id: cg.id, label: cg.label, count });
      }
    });

    return items;
  }, [films]);

  // Filtrer les résultats avec le moteur multi-critères sécurisé
  const searchResults = useMemo(() => {
    try {
      const typeFilter = selectedType === 'all' ? null : selectedType;
      return searchFilms(query, films, {
        type: typeFilter,
        genre: selectedGenre,
      });
    } catch (err) {
      console.error('Erreur lors du filtrage de recherche:', err);
      return [];
    }
  }, [query, films, selectedType, selectedGenre]);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (val && val.trim()) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleSelectGenre = (genreLabel) => {
    if (genreLabel === 'Tous') {
      setSelectedGenre('Tous');
      return;
    }
    setSelectedGenre(genreLabel);

    // Auto-ajuster le type si le genre sélectionné n'existe pas dans le filtre actif
    // (ex: l'utilisateur est sur l'onglet 'Films' mais clique sur 'Animation' qui n'est qu'une série)
    if (selectedType !== 'all') {
      const matchInCurrentType = films.some(
        f => f && isTypeMatch(f.type, selectedType) && matchGenreFilter(f.genre, genreLabel)
      );
      if (!matchInCurrentType) {
        setSelectedType('all');
      }
    }
  };

  const handleResetAll = () => {
    setQuery('');
    setSelectedType('all');
    setSelectedGenre('Tous');
    setSearchParams({}, { replace: true });
  };


  return (
    <div className="search-page-container">
      {/* En-tête de recherche */}
      <div className="search-header-panel">
        <h1 className="search-page-title">Rechercher sur Netflux</h1>
        <p className="search-page-subtitle">
          Trouvez vos films, séries, sagas, acteurs, réalisateurs et genres favoris
        </p>

        <div className="search-input-box">
          <svg className="search-box-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
          </svg>
          <input
            type="text"
            className="search-main-input"
            placeholder="Titre, acteur, saga, réalisateur (ex: Star Wars, Al Pacino, Nolan...)"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="search-clear-btn" onClick={() => handleQueryChange('')} title="Effacer le texte">
              ✕
            </button>
          )}
        </div>

        {/* Filtres de Type */}
        <div className="search-filters-row">
          <div className="search-type-tabs">
            <button
              className={`type-tab-btn ${selectedType === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedType('all')}
            >
              Tous ({films.length})
            </button>
            <button
              className={`type-tab-btn ${selectedType === 'film' ? 'active' : ''}`}
              onClick={() => setSelectedType('film')}
            >
              🎬 Films
            </button>
            <button
              className={`type-tab-btn ${selectedType === 'serie' ? 'active' : ''}`}
              onClick={() => setSelectedType('serie')}
            >
              📺 Séries
            </button>
          </div>
        </div>

        {/* Chips de genres canoniques uniques avec compteur */}
        {availableGenres.length > 1 && (
          <div className="search-genre-chips">
            {availableGenres.map((g) => (
              <button
                key={g.id}
                className={`genre-chip ${selectedGenre === g.label ? 'active' : ''}`}
                onClick={() => handleSelectGenre(g.label)}
              >
                {g.label} <span className="genre-chip-badge">{g.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="search-results-section">
        <div className="search-meta-bar">
          <div className="search-meta-left">
            <span className="search-results-count">
              {query ? (
                <>
                  Résultats pour « <strong>{query}</strong> »
                </>
              ) : (
                <>Catalogue Netflux</>
              )}
              {selectedGenre !== 'Tous' && (
                <>
                  {' '}dans le genre <span className="active-genre-pill">{selectedGenre}</span>
                </>
              )}
              {selectedType !== 'all' && (
                <>
                  {' '}({selectedType === 'film' ? 'Films uniquement' : 'Séries uniquement'})
                </>
              )}
              {' '}— <strong>{searchResults.length}</strong> titre{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
            </span>
          </div>

          {(query || selectedGenre !== 'Tous' || selectedType !== 'all') && (
            <button className="search-reset-all-btn" onClick={handleResetAll} title="Réinitialiser tous les filtres">
              ✕ Réinitialiser les filtres
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="search-loading">
            <div className="search-spinner"></div>
            <p>Chargement du catalogue Netflux...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="search-empty-state">
            <div className="empty-icon">🔍</div>
            <h3>
              {query
                ? `Aucun résultat trouvé pour « ${query} »`
                : `Aucun titre trouvé pour « ${selectedGenre} »`}
            </h3>
            <p>
              {selectedGenre !== 'Tous'
                ? `Aucun titre ne correspond à la combinaison du genre « ${selectedGenre} » avec vos filtres actifs.`
                : `Vérifiez l'orthographe ou explorez ces suggestions populaires :`}
            </p>
            <div className="empty-suggestions-tags">
              {['Star Wars', 'Inception', 'Naruto', 'Avatar', 'The Wire', 'Le Parrain', 'Shrek'].map((tag) => (
                <button
                  key={tag}
                  className="empty-suggestion-chip"
                  onClick={() => handleQueryChange(tag)}
                >
                  🎬 {tag}
                </button>
              ))}
            </div>
            <div className="empty-actions">
              <button className="empty-reset-btn" onClick={handleResetAll}>
                Afficher tout le catalogue Netflux ({films.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="search-cards-grid">
            {searchResults.map((film, index) => {
              if (!film) return null;
              const poster = getImageUrl(film.miniPortrait) || getImageUrl(film.miniPaysage) || getImageUrl(film.affiche);
              const isSerie = (film.type && typeof film.type === 'string' && film.type.toLowerCase().includes('serie')) || Array.isArray(film.saison);
              const durationLabel = isSerie
                ? (Array.isArray(film.saison) ? `${film.saison.length} Saison(s)` : 'Série')
                : formatDuration(film.duree || film.duration) || (typeof film.duree === 'string' ? film.duree : '');

              return (
                <div
                  key={film.id || `search-card-${index}`}
                  className="search-card"
                  onClick={() => setSelectedFilm(film)}
                >
                  <div className="search-card-img-wrapper">
                    {poster ? (
                      <img
                        src={poster}
                        alt={film.titre || 'Titre'}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className="search-card-placeholder" style={{ display: poster ? 'none' : 'flex' }}>
                      <span>🎬</span>
                      <p>{film.titre || 'Titre indisponible'}</p>
                    </div>
                    <span className="search-card-resolution">{film.resolutionmax || 'HD'}</span>
                    <span className="search-card-type-badge">{isSerie ? 'SÉRIE' : 'FILM'}</span>
                  </div>

                  <div className="search-card-info">
                    <div className="search-card-badges">
                      <span className="search-card-age">{film.restriction || '+12'}</span>
                      {film.annee && <span className="search-card-year">{film.annee}</span>}
                      {durationLabel && <span className="search-card-duration">{durationLabel}</span>}
                    </div>
                    <h3 className="search-card-title">{film.titre || 'Sans titre'}</h3>
                    <p className="search-card-genre">{film.genre || 'Action / Aventure'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modale de détails */}
      {selectedFilm && (
        <Modal
          film={selectedFilm}
          onClose={() => setSelectedFilm(null)}
          allFilms={films}
          onSelectFilm={setSelectedFilm}
        />
      )}
    </div>
  );
}
