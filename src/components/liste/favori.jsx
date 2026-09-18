import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../assets/Modal";
import fallbackFilms from "../../assets/Filmlist";
import { getStoredFavoris, EVENT_FAVORIS_UPDATED } from "../../assets/userLists";
import { getImageUrl } from "../../assets/filmHelpers";
import { getFilmsFromBdd } from "../../assets/ImportBDD";

function Favori() {
  const [favoriData, setFavoriData] = useState([]);
  const [allFilms, setAllFilms] = useState(fallbackFilms);
  const [selectedFilm, setSelectedFilm] = useState(null);

  const loadFavoris = () => {
    const favoris = getStoredFavoris();
    setFavoriData(favoris);
  };

  useEffect(() => {
    loadFavoris();

    // Charger les films de la BDD pour enrichir les fiches au clic
    let isMounted = true;
    getFilmsFromBdd(3500).then(bdd => {
      if (isMounted && Array.isArray(bdd) && bdd.length > 0) {
        setAllFilms(bdd);
      }
    });

    const handleUpdate = () => {
      loadFavoris();
    };

    window.addEventListener(EVENT_FAVORIS_UPDATED, handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener(EVENT_FAVORIS_UPDATED, handleUpdate);
    };
  }, []);

  const getFullFilmData = (favoriItem) => {
    const targetTitle = (favoriItem.titre || favoriItem.Title || '').toLowerCase();
    const found = allFilms.find(f => (f.titre || f.title || '').toLowerCase() === targetTitle);
    return found ? { ...found, ...favoriItem } : favoriItem;
  };

  const handleCardClick = (favoriItem) => {
    const full = getFullFilmData(favoriItem);
    setSelectedFilm(full);
  };

  const handleCloseModal = () => {
    setSelectedFilm(null);
    loadFavoris();
  };

  return (
    <div id="favori-content">
      {favoriData.length === 0 ? (
        <div style={{
          width: '100%',
          textAlign: 'center',
          padding: '60px 20px',
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⭐</div>
          <h3 style={{ color: '#ffffff', fontSize: '1.4rem', margin: '0 0 8px 0' }}>Votre liste de favoris est vide</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem' }}>
            Cliquez sur l'étoile d'un film ou d'une série pour l'ajouter à vos favoris.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              background: '#004b87',
              color: '#ffffff',
              padding: '8px 22px',
              borderRadius: '20px',
              fontWeight: 700,
              textDecoration: 'none',
              border: '1px solid #0077b6'
            }}
          >
            Explorer le catalogue Netflux
          </Link>
        </div>
      ) : (
        favoriData.map((item, idx) => {
          const poster = getImageUrl(item.miniPortrait || item.img || item.affiche) || getImageUrl(item.miniPaysage);
          const title = item.titre || item.Title || 'Film favori';
          return (
            <div
              key={item.id || item.Title || idx}
              className="favori-cards"
              onClick={() => handleCardClick(item)}
              title={title}
              style={{ cursor: 'pointer' }}
            >
              {poster ? (
                <img
                  src={poster}
                  alt={title}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  aspectRatio: '2/3',
                  background: 'linear-gradient(135deg, #0a192f 0%, #003362 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700,
                  textAlign: 'center',
                  padding: '10px'
                }}>
                  🎬 {title}
                </div>
              )}
            </div>
          );
        })
      )}

      {selectedFilm && (
        <Modal
          film={selectedFilm}
          onClose={handleCloseModal}
          allFilms={allFilms}
          onSelectFilm={setSelectedFilm}
        />
      )}
    </div>
  );
}

export default Favori;