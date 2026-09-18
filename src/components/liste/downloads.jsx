import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import fallbackFilms from "../../assets/Filmlist";
import { getStoredDownloads, toggleFilmDownload, EVENT_DOWNLOADS_UPDATED } from "../../assets/userLists";
import { getImageUrl } from "../../assets/filmHelpers";
import { getFilmsFromBdd } from "../../assets/ImportBDD";
import Modal from "../../assets/Modal";
import play from "../../assets/svg/play.svg";
import suppr from "../../assets/svg/suppr.svg";

function Downloads() {
  const [downloadData, setDownloadData] = useState([]);
  const [allFilms, setAllFilms] = useState(fallbackFilms);
  const [selectedFilm, setSelectedFilm] = useState(null);

  const loadDownloads = useCallback(() => {
    const rawDownloads = getStoredDownloads();
    const fullDownloads = rawDownloads.map(dl => {
      const targetTitle = (dl.titre || dl.Title || '').toLowerCase();
      const match = allFilms.find(f => (f.titre || f.title || '').toLowerCase() === targetTitle);
      return match ? { ...match, ...dl } : dl;
    });
    setDownloadData(fullDownloads);
  }, [allFilms]);

  useEffect(() => {
    loadDownloads();

    let isMounted = true;
    getFilmsFromBdd(3500).then(bdd => {
      if (isMounted && Array.isArray(bdd) && bdd.length > 0) {
        setAllFilms(bdd);
      }
    });

    const handleUpdate = () => {
      loadDownloads();
    };

    window.addEventListener(EVENT_DOWNLOADS_UPDATED, handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener(EVENT_DOWNLOADS_UPDATED, handleUpdate);
    };
  }, [loadDownloads]);

  const playClicked = (film) => {
    setSelectedFilm(film);
  };

  const supprClicked = (filmToRemove) => {
    toggleFilmDownload(filmToRemove);
  };

  return (
    <div id="dl-content">
      {downloadData.length === 0 ? (
        <div style={{
          width: '100%',
          textAlign: 'center',
          padding: '60px 20px',
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⬇️</div>
          <h3 style={{ color: '#ffffff', fontSize: '1.4rem', margin: '0 0 8px 0' }}>Aucun téléchargement</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem' }}>
            Téléchargez vos films et séries préférés pour les regarder même sans connexion internet.
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
        downloadData.map((item, index) => {
          const imgUrl = getImageUrl(item.miniPaysage || item.miniPortrait || item.affiche);
          const title = item.titre || item.Title || "Film";
          return (
            <div key={item.id || item.Title || index} className="dl-cards">
              <img
                src={imgUrl || ''}
                alt={title}
                className="dl-element-img"
                onClick={() => setSelectedFilm(item)}
                style={{ cursor: 'pointer' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="dl-text" onClick={() => setSelectedFilm(item)} style={{ cursor: 'pointer' }}>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 4px 0' }}>{title}</p>
                <p className="dl-description">{item.synopsis || item.description || "Pas de description"}</p>
              </div>
              <div className="dl-actions">
                <button className="dl-btn dl-btn-play" onClick={() => playClicked(item)} title="Regarder">
                  <img src={play} alt="bouton lecture" />
                </button>
                <button className="dl-btn dl-btn-suppr" onClick={() => supprClicked(item)} title="Supprimer des téléchargements">
                  <img src={suppr} alt="bouton supprimer" />
                </button>
              </div>
            </div>
          );
        })
      )}

      {selectedFilm && (
        <Modal
          film={selectedFilm}
          onClose={() => {
            setSelectedFilm(null);
            loadDownloads();
          }}
          allFilms={allFilms}
          onSelectFilm={setSelectedFilm}
        />
      )}
    </div>
  );
}

export default Downloads;