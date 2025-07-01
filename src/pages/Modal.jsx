import './Modal.css';
import { useState } from 'react';


export default function Modal({ film, onClose }) {
  const [selectedSaisonIndex, setSelectedSaisonIndex] = useState(0);
  const [isFavorie, setIsFavorie] = useState(film?.favorie || false);
  const [isDownload, setIsDownload] = useState(film?.download || false); 
  
    if (!film) return null;
    const toggleFavorie = () => {
      setIsFavorie(!isFavorie);
      film.favorie = !isFavorie;
    };
    const toggleDownload = () => { // AJOUT
    setIsDownload(!isDownload);
    film.download = !isDownload;
    };

  return (
  <div className="modal-container">
    <div className="modal-backdrop  " onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-image-wrapper">
          <img
            src={`/minia/${film.miniPaysage}`}
            alt={film.titre}
            className="modal-image"
          />
          <span className="resolution">{film.resolutionmax}</span>

          <div className="modal-overlay">
            <img
              src={`/minia/${film.titleIMG}`}
              alt={film.titre}
              className="modal-titre"
            />
             <div className="modal-buttons">
              <button className="modal-lecture">Lecture</button> 
               <button className="modal-favorie" onClick={toggleFavorie}>
                <svg xmlns="http://www.w3.org/2000/svg" className='ModalFavorieButton' viewBox="0 0 41 41" fill="none">
                  <path
                  d="M26.347 12.0074L22.0042 2.99257C21.2568 1.44102 19.0284 1.49675 18.3594 3.08372L14.6289 11.9337C14.3509 12.5933 13.7414 13.0541 13.031 13.1417L4.14202 14.2388C2.47553 14.4445 1.789 16.4881 2.99333 17.6582L9.96559 24.4322C10.4853 24.9371 10.6913 25.6837 10.5039 26.3837L7.76476 36.6185C7.31529 38.2979 9.07487 39.7116 10.618 38.9108L19.1596 34.4781C19.7372 34.1783 20.4245 34.1783 21.0021 34.4781L29.8046 39.0462C31.3054 39.825 33.0355 38.5056 32.6815 36.8522L30.4412 26.3889C30.2905 25.6849 30.5297 24.9543 31.0675 24.4759L38.6623 17.7193C39.9533 16.5708 39.2786 14.4362 37.5621 14.2382L27.9197 13.1262C27.2383 13.0476 26.6447 12.6254 26.347 12.0074Z"
                        stroke="#D9D9D9"
                        strokeWidth="3"
                        fill={isFavorie ? "#D9D9D9" : "none"}
                  />
                </svg>
              </button>
              <button className="modal-download" onClick={toggleDownload}>
                <svg xmlns="http://www.w3.org/2000/svg"className='MoadlaDownloadSvg'  viewBox="0 0 37 37" fill="none">
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

        {film.type === "Film" && (
          <div className="modal-details">
            <h5>{film.genre}</h5>
            <div className="modal-details-grid">
              <div className="modal-left">
                <div className="modal-infobase">
                  <h4>{film.annee}</h4>
                  <h4>{film.duree}</h4>
                  <h4>{film.restriction}</h4>
                </div>
                <p className="modal-synopsis">{film.synopsis}</p>
              </div>
              <div className="modal-infodistrib">
                <p>
                  <strong>Distribution:</strong> {film.distribution}
                </p>
                <p>
                  <strong>Réalisation:</strong> {film.realisation}
                </p>
              </div>
            </div>
          </div>

        )
        }
        {
          film.type === "Serie" && (
          <div className="modal-details">
            <h5>{film.genre}</h5>
            <div className="modal-details-grid">
              <div className="modal-left">
                <div className="modal-infobase">
                  <h4>{film.annee}</h4>
                  {film.saison && <h4>{film.saison.length} Saisons</h4>}
                  <h4>{film.restriction}</h4>
                </div>
                <p className="modal-synopsis">{film.synopsis}</p>
              </div>
              <div className="modal-infodistrib">
                <p>
                  <strong>Distribution:</strong> {film.distribution}
                </p>
                <p>
                  <strong>Réalisation:</strong> {film.realisation}
                </p>
              </div>
            </div>

            {/* --- Dropdown et épisodes --- */}
          {film.saison && film.saison.length > 0 && (
            <div>
              <h3>Épisodes</h3>

              <select
                value={selectedSaisonIndex}
                onChange={(e) => setSelectedSaisonIndex(Number(e.target.value))}
              >
                {film.saison.map((s, index) => (
                  <option key={index} value={index}>
                    Saison {s.saison}
                  </option>
                ))}
              </select>

              <div className="episode-list">
                {film.saison[selectedSaisonIndex].episodes.map((ep, i) => (
                  <div key={(1+i)} className="episode-card">
                    
                    <img src={`/minia/epSerie/Southpark/${ep.minia}`} alt={ep.titre} />
                    
                       <div className="episode-card-title">
                        
                          <h6>{i+"."+ep.titre} </h6>
                        <h6>{ep.duree}</h6>
                        <button className="episode-card-download" onClick={toggleDownload}>
                          <svg xmlns="http://www.w3.org/2000/svg"className='episode-cardDownloadSvg'  viewBox="0 0 37 37" fill="none">
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
                        <p>{ep.synopsis}</p>
                    
                   
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
          
          )
        }

        <button className='CloseModalButton' onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
        </button>
      </div>
    </div>
  </div>
  );
}
