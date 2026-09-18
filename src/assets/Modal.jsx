import './Modal.css';
import { useState, useEffect } from 'react';
import { getMissingFields, getImageUrl, isPlaceholderOrEmpty, formatDuration, getEpisodeImageUrl, getSimilarFilms } from './filmHelpers';
import { isFilmFavori, toggleFilmFavori, isFilmDownloaded, toggleFilmDownload } from './userLists';

export default function Modal({ film, onClose, allFilms = [], onSelectFilm }) {
  const [selectedSaisonIndex, setSelectedSaisonIndex] = useState(0);
  const [isFavorie, setIsFavorie] = useState(() => isFilmFavori(film));
  const [isDownload, setIsDownload] = useState(() => isFilmDownloaded(film));

  useEffect(() => {
    if (film) {
      setIsFavorie(isFilmFavori(film));
      setIsDownload(isFilmDownloaded(film));
      setSelectedSaisonIndex(0);
      const modalContent = document.querySelector('.modal-content');
      if (modalContent) modalContent.scrollTop = 0;
    }
  }, [film]);

  if (!film) return null;

  const handleToggleFavori = () => {
    const newState = toggleFilmFavori(film);
    setIsFavorie(newState);
  };

  const handleToggleDownload = () => {
    const newState = toggleFilmDownload(film);
    setIsDownload(newState);
  };


  const seasonsData = Array.isArray(film.saison) ? film.saison : Array.isArray(film.episodes) ? film.episodes : null;
  const isSerie = (film.type && film.type.toLowerCase().includes('serie')) || Boolean(seasonsData) || Boolean(film.saisons);
  const missingFields = getMissingFields(film);
  const headerImageUrl = getImageUrl(film.miniPaysage) || getImageUrl(film.miniPortrait) || getImageUrl(film.affiche);
  const titleImageUrl = getImageUrl(film.titleIMG);
  const similarFilms = getSimilarFilms(film, allFilms, 6);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-image-wrapper">
          {headerImageUrl ? (
            <img
              src={headerImageUrl}
              alt={film.titre || 'Affiche'}
              className="modal-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="modal-image-fallback">
              <span>🎬 {film.titre || 'Titre manquant'}</span>
            </div>
          )}
          <span className="resolution">{film.resolutionmax || 'HD'}</span>

          <div className="modal-overlay">
            {titleImageUrl ? (
              <img
                src={titleImageUrl}
                alt={film.titre || 'Titre'}
                className="modal-titre"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <h2 className="modal-titre-text">{film.titre || film.title || 'Titre manquant'}</h2>
            )}

            <div className="modal-buttons">
              <button className="modal-lecture">Lecture</button> 
              <button
                className={`modal-favorie ${isFavorie ? 'active' : ''}`}
                onClick={handleToggleFavori}
                title={isFavorie ? "Retirer de ma liste" : "Ajouter à ma liste"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ModalFavorieButton"
                  viewBox="0 0 41 41"
                  fill="none"
                >
                  <path
                    d="M26.347 12.0074L22.0042 2.99257C21.2568 1.44102 19.0284 1.49675 18.3594 3.08372L14.6289 11.9337C14.3509 12.5933 13.7414 13.0541 13.031 13.1417L4.14202 14.2388C2.47553 14.4445 1.789 16.4881 2.99333 17.6582L9.96559 24.4322C10.4853 24.9371 10.6913 25.6837 10.5039 26.3837L7.76476 36.6185C7.31529 38.2979 9.07487 39.7116 10.618 38.9108L19.1596 34.4781C19.7372 34.1783 20.4245 34.1783 21.0021 34.4781L29.8046 39.0462C31.3054 39.825 33.0355 38.5056 32.6815 36.8522L30.4412 26.3889C30.2905 25.6849 30.5297 24.9543 31.0675 24.4759L38.6623 17.7193C39.9533 16.5708 39.2786 14.4362 37.5621 14.2382L27.9197 13.1262C27.2383 13.0476 26.6447 12.6254 26.347 12.0074Z"
                    stroke="#D9D9D9"
                    strokeWidth="3"
                    fill={isFavorie ? "#D9D9D9" : "none"}
                  />
                </svg>
              </button>

              <button
                className={`modal-download ${isDownload ? 'active' : ''}`}
                onClick={handleToggleDownload}
                title={isDownload ? "Téléchargé (cliquer pour supprimer)" : "Télécharger"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className='MoadlaDownloadSvg' viewBox="0 0 37 37" fill="none">
                  <path d="M17 2C17 1.44772 17.4477 1 18 1H20C20.5523 1 21 1.44772 21 2V20.0858C21 20.9767 22.0771 21.4229 22.7071 20.7929L27.8543 15.6457C28.22 15.28 28.8042 15.2535 29.2016 15.5846L30.6588 16.799C31.1105 17.1754 31.1415 17.8585 30.7257 18.2743L21.7929 27.2071C21.6054 27.3946 21.351 27.5 21.0858 27.5H16.9142C16.649 27.5 16.3946 27.3946 16.2071 27.2071L7.20711 18.2071C6.81658 17.8166 6.81658 17.1834 7.20711 16.7929L8.29289 15.7071C8.68342 15.3166 9.31658 15.3166 9.70711 15.7071L15.2929 21.2929C15.9229 21.9229 17 21.4767 17 20.5858V2Z"
                    fill={isDownload ? "#D9D9D9" : "none"}
                    stroke="#D9D9D9"
                  />
                  <path d="M1 25C1 24.4477 1.44772 24 2 24H3.5C4.05228 24 4.5 24.4477 4.5 25V31.2436C4.5 31.7959 4.94772 32.2436 5.5 32.2436H31.5C32.0523 32.2436 32.5 31.7959 32.5 31.2436V25C32.5 24.4477 32.9477 24 33.5 24H35C35.5523 24 36 24.4477 36 25V35C36 35.5523 35.5523 36 35 36H2C1.44772 36 1 35.5523 1 35V25Z"
                    fill={isDownload ? "#D9D9D9" : "none"}
                    stroke="#D9D9D9"
                  />
                </svg>
              </button>
            </div>
          </div> 
        </div>

        {/* Alerte des données manquantes pour que l'utilisateur puisse compléter */}
        {missingFields.length > 0 && (
          <div className="modal-missing-panel">
            <div className="modal-missing-header">
              <span className="modal-missing-badge-title">⚠️ DONNÉES INCOMPLÈTES</span>
              <span className="modal-missing-count">{missingFields.length} champ(s) manquant(s) à compléter dans la base :</span>
            </div>
            <div className="modal-missing-chips">
              {missingFields.map((field, idx) => (
                <span key={idx} className="missing-chip">
                  {field}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Détails du film ou de la série */}
        <div className="modal-details">
          <h5>
            {isPlaceholderOrEmpty(film.genre) ? (
              <span className="missing-data-text">⚠️ Genre non renseigné</span>
            ) : Array.isArray(film.genre) ? (
              film.genre.join(', ')
            ) : (
              film.genre
            )}
          </h5>
          <div className="modal-details-grid">
            <div className="modal-left">
              <div className="modal-infobase">
                <h4>{film.annee || film.year || <span className="missing-data-text">Année ?</span>}</h4>
                {isSerie ? (
                  <h4>
                    {seasonsData
                      ? `${seasonsData.length} Saison(s)`
                      : film.saisons
                      ? `${film.saisons} Saison(s)`
                      : <span className="missing-data-text">Saisons ?</span>}
                  </h4>
                ) : (
                  <h4>
                    {formatDuration(film.duree || film.duration) || <span className="missing-data-text">Durée ?</span>}
                  </h4>
                )}
                <h4>{film.restriction || <span className="missing-data-text">Âge ?</span>}</h4>
              </div>
              <p className="modal-synopsis">
                {isPlaceholderOrEmpty(film.synopsis) && isPlaceholderOrEmpty(film.description) ? (
                  <span className="missing-data-text">⚠️ Synopsis non renseigné dans la base de données.</span>
                ) : (
                  film.synopsis || film.description
                )}
              </p>
            </div>
            <div className="modal-infodistrib">
              <p>
                <strong>Distribution :</strong>{' '}
                {isPlaceholderOrEmpty(film.distribution) ? (
                  <span className="missing-data-text">Non renseignée</span>
                ) : (
                  film.distribution
                )}
              </p>
              <p>
                <strong>Réalisation :</strong>{' '}
                {isPlaceholderOrEmpty(film.realisation) ? (
                  <span className="missing-data-text">Non renseignée</span>
                ) : (
                  film.realisation
                )}
              </p>
              <p>
                <strong>Type :</strong>{' '}
                {film.type || <span className="missing-data-text">Non spécifié (Film ou Série)</span>}
              </p>
            </div>
          </div>
        </div>

        {/* --- Dropdown et épisodes pour les séries --- */}
        {isSerie && (
          <div>
            <h3>Épisodes</h3>
            {seasonsData && seasonsData.length > 0 ? (
              <>
                <select
                  className='SaisonsButton'
                  value={selectedSaisonIndex}
                  onChange={(e) => setSelectedSaisonIndex(Number(e.target.value))}
                >
                  {seasonsData.map((s, index) => (
                    <option className='SaisonsButton' key={index} value={index}> 
                      Saison {s.saison || (index + 1)}
                    </option>
                  ))}
                </select>

                <div className="episode-list">
                  {seasonsData[selectedSaisonIndex]?.episodes?.map((ep, i) => (
                    <div key={(1+i)} className="episode-card">
                      <div className="episode-card-img-wrapper">
                        <img
                          src={getEpisodeImageUrl(ep.minia, film.titre) || headerImageUrl || ''}
                          alt={ep.titre || 'Episode'}
                          onError={(e) => {
                            if (headerImageUrl && e.currentTarget.src !== headerImageUrl) {
                              e.currentTarget.src = headerImageUrl;
                            }
                          }}
                        />
                        {Number(ep.watchtime) > 7 && Number(ep.watchtime) < 93 && (
                          <div className="card-progressbar">
                            <div
                              className="card-progressbar-fill"
                              style={{ width: `${Math.min(Math.max(Number(ep.watchtime), 0), 100)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                      
                      <div className="episode-card-title">
                        <h6>{(i+1) + ". " + (ep.titre || "Titre de l'épisode manquant")}</h6>
                        <h6>{ep.duree || "Durée ?"}</h6>
                        <button className={`episode-card-download ${isDownload ? 'active' : ''}`} onClick={handleToggleDownload} title={isDownload ? "Téléchargé" : "Télécharger"}>
                          <svg xmlns="http://www.w3.org/2000/svg" className='episode-cardDownloadSvg' viewBox="0 0 37 37" fill="none">
                            <path d="M17 2C17 1.44772 17.4477 1 18 1H20C20.5523 1 21 1.44772 21 2V20.0858C21 20.9767 22.0771 21.4229 22.7071 20.7929L27.8543 15.6457C28.22 15.28 28.8042 15.2535 29.2016 15.5846L30.6588 16.799C31.1105 17.1754 31.1415 17.8585 30.7257 18.2743L21.7929 27.2071C21.6054 27.3946 21.351 27.5 21.0858 27.5H16.9142C16.649 27.5 16.3946 27.3946 16.2071 27.2071L7.20711 18.2071C6.81658 17.8166 6.81658 17.1834 7.20711 16.7929L8.29289 15.7071C8.68342 15.3166 9.31658 15.3166 9.70711 15.7071L15.2929 21.2929C15.9229 21.9229 17 21.4767 17 20.5858V2Z"
                              fill={isDownload ? "#D9D9D9" : "none"}
                              stroke="#D9D9D9"
                            />
                            <path d="M1 25C1 24.4477 1.44772 24 2 24H3.5C4.05228 24 4.5 24.4477 4.5 25V31.2436C4.5 31.7959 4.94772 32.2436 5.5 32.2436H31.5C32.0523 32.2436 32.5 31.7959 32.5 31.2436V25C32.5 24.4477 32.9477 24 33.5 24H35C35.5523 24 36 24.4477 36 25V35C36 35.5523 35.5523 36 35 36H2C1.44772 36 1 35.5523 1 35V25Z"
                              fill={isDownload ? "#D9D9D9" : "none"}
                              stroke="#D9D9D9"
                            />
                          </svg>
                        </button>
                      </div>
                      <p>{ep.synopsis || <span className="missing-data-text">Synopsis de l'épisode à renseigner.</span>}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="missing-data-text">⚠️ Aucun épisode renseigné pour cette série dans la base de données.</p>
            )}
          </div>
        )}

        {/* --- Section Recommandations / Titres similaires --- */}
        {similarFilms && similarFilms.length > 0 && (
          <div className="modal-similar-section">
            <h3 className="modal-similar-heading">Titres similaires</h3>
            <div className="modal-similar-grid">
              {similarFilms.map((sim, i) => {
                if (!sim) return null;
                const simImg = getImageUrl(sim.miniPaysage) || getImageUrl(sim.miniPortrait) || getImageUrl(sim.affiche);
                const isSimSerie = (sim.type && typeof sim.type === 'string' && sim.type.toLowerCase().includes('serie')) || Array.isArray(sim.saison);
                const durationLabel = isSimSerie
                  ? (Array.isArray(sim.saison) ? `${sim.saison.length} Saison(s)` : 'Série')
                  : formatDuration(sim.duree || sim.duration) || (typeof sim.duree === 'string' ? sim.duree : '');

                return (
                  <div
                    key={sim.id || `sim-${i}`}
                    className="similar-card"
                    onClick={() => {
                      if (onSelectFilm) {
                        onSelectFilm(sim);
                      }
                    }}
                  >
                    <div className="similar-card-img-wrapper">
                      {simImg ? (
                        <img
                          src={simImg}
                          alt={sim.titre || 'Film similaire'}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className="similar-card-placeholder" style={{ display: simImg ? 'none' : 'flex' }}>
                        <span>🎬</span>
                        <p>{sim.titre}</p>
                      </div>
                      <span className="similar-card-resolution">{sim.resolutionmax || 'HD'}</span>
                    </div>

                    <div className="similar-card-body">
                      <div className="similar-card-meta">
                        <span className="similar-card-badge">{sim.restriction || '+12'}</span>
                        <span className="similar-card-year">{sim.annee || sim.year || ''}</span>
                        {durationLabel && <span className="similar-card-duration">{durationLabel}</span>}
                      </div>
                      <h4 className="similar-card-title">{sim.titre}</h4>
                      <p className="similar-card-synopsis">
                        {sim.synopsis || sim.description || 'Sélectionnez ce titre pour découvrir ses détails.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button className='CloseModalButton' onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
        </button>
      </div>
    </div>
  );
}
