import { useState, useEffect, useRef } from 'react';
import searchIcon from '../../assets/svg/search.svg';
import '../searchbar/searchbar.css';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { getFilmsFromBdd } from '../../assets/ImportBDD';
import fallbackFilms from '../../assets/Filmlist';
import { searchFilms, getImageUrl } from '../../assets/filmHelpers';
import Modal from '../../assets/Modal';

function Searchbar() {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState('');
  const [films, setFilms] = useState(fallbackFilms);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const isSearchPage = location.pathname === '/search';

  // Synchroniser avec l'URL si on est sur la page /search
  useEffect(() => {
    if (isSearchPage) {
      const qFromUrl = searchParams.get('q') || '';
      setQuery(qFromUrl);
      setIsActive(true);
    }
  }, [isSearchPage, searchParams]);

  // Charger le catalogue pour les suggestions instantanées
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const data = await getFilmsFromBdd(3500);
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setFilms(data);
        }
      } catch {
        // Fallback déjà en place
      }
    };
    fetchCatalog();
    return () => { isMounted = false; };
  }, []);

  // Mettre à jour les suggestions quand la query change (uniquement hors de /search)
  useEffect(() => {
    if (isSearchPage || !query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const matches = searchFilms(query, films);
      setSuggestions(matches.slice(0, 5));
    } catch {
      setSuggestions([]);
    }
  }, [query, films, isSearchPage]);

  // Fermer la recherche au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        if (!isSearchPage && !query) {
          setIsActive(false);
        }
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchPage, query]);

  const handleIconClick = () => {
    if (!isSearchPage) {
      // Navigue directement vers la page recherche dédiée
      navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
      setSuggestions([]);
    } else {
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (isSearchPage) {
      navigate(val.trim() ? `/search?q=${encodeURIComponent(val)}` : '/search', { replace: true });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSuggestions([]);
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      } else {
        navigate('/search');
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      if (!isSearchPage) {
        setIsActive(false);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    if (isSearchPage) {
      navigate('/search', { replace: true });
    }
    inputRef.current?.focus();
  };

  const handleSelectSuggestion = (film) => {
    setSuggestions([]);
    setSelectedFilm(film);
  };

  const handleViewAllResults = () => {
    setSuggestions([]);
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/search');
    }
  };


  return (
    <>
      <div ref={searchRef} className={`search-container ${isActive ? 'search-container-active' : ''}`}>
        <div className="search-bar-inner">
          <img
            id="search-img"
            src={searchIcon}
            alt="Rechercher sur Netflux"
            title="Rechercher"
            onClick={handleIconClick}
          />
          <input
            ref={inputRef}
            type="text"
            className={`search-input-field ${isActive ? 'input-active' : ''}`}
            id="search-input"
            placeholder="Titres, acteurs, genres..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim()) {
                const matches = searchFilms(query, films);
                setSuggestions(matches.slice(0, 5));
              }
            }}
          />
          {isActive && query && (
            <button className="search-clear-mini-btn" onClick={handleClear} title="Effacer">
              ✕
            </button>
          )}
        </div>

        {/* Dropdown d'aperçu instantané */}
        {isActive && suggestions.length > 0 && (
          <div className="search-dropdown-results">
            <div className="search-dropdown-header">
              <span>Suggestions rapides</span>
              <span className="search-dropdown-count">{suggestions.length} aperçu(s)</span>
            </div>

            <div className="search-dropdown-list">
              {suggestions.map((film, idx) => {
                if (!film) return null;
                const thumb = getImageUrl(film.miniPortrait) || getImageUrl(film.miniPaysage) || getImageUrl(film.affiche);
                const isSerie = (film.type && typeof film.type === 'string' && film.type.toLowerCase().includes('serie')) || Array.isArray(film.saison);

                return (
                  <div
                    key={film.id || `sugg-${idx}`}
                    className="search-dropdown-item"
                    onClick={() => handleSelectSuggestion(film)}
                  >
                    <div className="dropdown-item-thumb">
                      {thumb ? (
                        <img src={thumb} alt={film.titre} />
                      ) : (
                        <div className="dropdown-item-placeholder">🎬</div>
                      )}
                    </div>
                    <div className="dropdown-item-info">
                      <h5 className="dropdown-item-title">{film.titre}</h5>
                      <div className="dropdown-item-meta">
                        <span className="dropdown-badge-type">{isSerie ? 'SÉRIE' : 'FILM'}</span>
                        {film.annee && <span className="dropdown-item-year">{film.annee}</span>}
                        {film.restriction && <span className="dropdown-item-age">{film.restriction}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="search-dropdown-all-btn" onClick={handleViewAllResults}>
              Voir tous les résultats pour « {query} » →
            </button>
          </div>
        )}
      </div>

      {/* Modale lorsqu'on clique sur une suggestion directe */}
      {selectedFilm && (
        <Modal
          film={selectedFilm}
          onClose={() => setSelectedFilm(null)}
          allFilms={films}
          onSelectFilm={setSelectedFilm}
        />
      )}
    </>
  );
}

export default Searchbar;