import fallbackFilms from './Filmlist';
import { getFilmsFromBdd } from "./ImportBDD";
import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useMediaQuery } from 'react-responsive';
import './Mainpage.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { getMissingFields, getImageUrl, isTypeMatch } from './filmHelpers';
import { isFilmFavori, toggleFilmFavori } from './userLists';

function getWatchtime(film) {
  if (!film) return 0;
  // Si moins de 7% du début (<= 7%) ou moins de 7% de la fin (>= 93%), pas de barre ni reprendre
  if (film.watchtime !== undefined && film.watchtime !== null) {
    const wt = Number(film.watchtime);
    if (!isNaN(wt) && wt > 7 && wt < 93) {
      return Math.min(Math.max(wt, 0), 100);
    }
    return 0;
  }
  if (Array.isArray(film.saison)) {
    for (const s of film.saison) {
      if (Array.isArray(s.episodes)) {
        const inProgress = s.episodes.find(ep => {
          const wt = Number(ep.watchtime);
          return !isNaN(wt) && wt > 7 && wt < 93;
        });
        if (inProgress) {
          return Math.min(Math.max(Number(inProgress.watchtime), 0), 100);
        }
      }
    }
  }
  return 0;
}

export default function Acceuil({ filterType = null }) {
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [films, setFilms] = useState(fallbackFilms);
  const initialPool = filterType ? fallbackFilms.filter(f => isTypeMatch(f?.type, filterType)) : fallbackFilms;
  const initialRandom = initialPool.length > 0 ? initialPool[Math.floor(Math.random() * initialPool.length)] : fallbackFilms[0];
  const [randomHeadIMG, setRandomFilm] = useState(initialRandom || null);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const fetchFilms = async () => {
      let data = [];
      try {
        data = await getFilmsFromBdd();
        if (!data || data.length === 0) {
          console.warn("Base de données Firestore vide, utilisation du catalogue local.");
          data = fallbackFilms;
        }
      } catch (error) {
        console.error("Erreur lors du chargement des films depuis Firebase :", error);
        console.info("Utilisation des films locaux en secours (fallback).");
        data = fallbackFilms;
      } finally {
        setFilms(data);

        // Affiche la liste des contenus incomplets dans la console pour aider l'utilisateur
        const incomplete = data.filter(f => getMissingFields(f).length > 0);
        if (incomplete.length > 0) {
          console.group(`⚠️ Netflux : ${incomplete.length} film(s)/série(s) avec des données manquantes :`);
          incomplete.forEach(f => {
            console.warn(`• "${f.titre || f.title || 'Sans titre'}" (ID: ${f.id || 'local'}) -> Manque :`, getMissingFields(f));
          });
          console.groupEnd();
        }

        const targetPool = filterType
          ? data.filter(f => isTypeMatch(f.type, filterType))
          : data;

        const pool = targetPool.length > 0 ? targetPool : data;
        const withPaysage = pool.filter(f => f.miniPaysage || f.miniPortrait);
        if (withPaysage.length > 0) {
          const film = withPaysage[Math.floor(Math.random() * withPaysage.length)];
          setRandomFilm(film);
        } else if (pool.length > 0) {
          setRandomFilm(pool[0]);
        }
        setIsLoading(false);
      }
    };

    fetchFilms();
  }, [filterType]);

  const displayedFilms = filterType
    ? films.filter(f => isTypeMatch(f.type, filterType))
    : films;

  const incompleteCount = displayedFilms.filter(f => getMissingFields(f).length > 0).length;

  const top10MostViewed = [...displayedFilms]
    .sort((a, b) => (b.view || 0) - (a.view || 0))
    .slice(0, 10);

  const filmsToResume = displayedFilms.filter(film => {
    return getWatchtime(film) > 0;
  });

  const shouldUseSlider = filmsToResume.length > 5 || (isMobile && filmsToResume.length > 2);

  if (isLoading) {
    return <div className="loading">Chargement des films...</div>;
  }
return (

  <div className='container'>
    <div className='headpage'>
      {randomHeadIMG && (
        <img
          src={getImageUrl(isMobile ? (randomHeadIMG.miniPortrait || randomHeadIMG.miniPaysage) : (randomHeadIMG.miniPaysage || randomHeadIMG.miniPortrait)) || ''}
          alt="image d'accueil aléatoire"
          className="headpageIMG"
          onError={(e) => {
            e.currentTarget.style.opacity = '0.3';
          }}
        />
      )}
      
      {randomHeadIMG && (
      <div className='HeadInfo'>
        <button id='HeadLecture' className='headButton'> 
          <svg xmlns="http://www.w3.org/2000/svg" className='LectureButton'  viewBox="0 0 35 42" fill="none">
          <path d="M2 3.6735C2 2.08907 3.75464 1.13377 5.08543 1.99366L31.9003 19.3202C33.1197 20.1081 33.1197 21.8919 31.9003 22.6798L5.08543 40.0063C3.75464 40.8662 2 39.9109 2 38.3265V3.6735Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth="3"/>
          </svg>  <u>Lecture</u>

        </button>
        <button className='Infobutton'  onClick={() => randomHeadIMG && setSelectedFilm(randomHeadIMG)}>
          <svg xmlns="http://www.w3.org/2000/svg" className='infoButton'  viewBox="0 0 60 60" fill="none">
            <g clipPath="url(#clip0_79_131)">
            <path d="M30 2.50001C24.561 2.50001 19.2442 4.11286 14.7218 7.1346C10.1995 10.1563 6.67474 14.4513 4.59333 19.4762C2.51192 24.5012 1.96732 30.0305 3.02842 35.365C4.08951 40.6995 6.70863 45.5995 10.5546 49.4454C14.4005 53.2914 19.3006 55.9105 24.635 56.9716C29.9695 58.0327 35.4988 57.4881 40.5238 55.4067C45.5488 53.3253 49.8437 49.8005 52.8654 45.2782C55.8872 40.7558 57.5 35.439 57.5 30C57.5166 26.384 56.8166 22.8006 55.4404 19.4567C54.0643 16.1127 52.0393 13.0746 49.4823 10.5177C46.9254 7.96076 43.8873 5.93576 40.5434 4.55962C37.1994 3.18347 33.616 2.48346 30 2.50001ZM32.5 42.5C32.5 43.1631 32.2366 43.7989 31.7678 44.2678C31.2989 44.7366 30.6631 45 30 45C29.337 45 28.7011 44.7366 28.2322 44.2678C27.7634 43.7989 27.5 43.1631 27.5 42.5V27.5C27.5 26.837 27.7634 26.2011 28.2322 25.7322C28.7011 25.2634 29.337 25 30 25C30.6631 25 31.2989 25.2634 31.7678 25.7322C32.2366 26.2011 32.5 26.837 32.5 27.5V42.5ZM30 20C29.5056 20 29.0222 19.8534 28.6111 19.5787C28.2 19.304 27.8795 18.9135 27.6903 18.4567C27.5011 17.9999 27.4516 17.4972 27.548 17.0123C27.6445 16.5273 27.8826 16.0819 28.2322 15.7322C28.5819 15.3826 29.0273 15.1445 29.5123 15.048C29.9972 14.9516 30.4999 15.0011 30.9567 15.1903C31.4135 15.3795 31.804 15.7 32.0787 16.1111C32.3534 16.5222 32.5 17.0056 32.5 17.5C32.5 18.1631 32.2366 18.7989 31.7678 19.2678C31.2989 19.7366 30.6631 20 30 20Z" fill="#D9D9D9"/>
            </g>
            <rect x="0.5" y="0.5" width="59" height="59" stroke="#D9D9D9"/>
            <defs>
            <clipPath id="clip0_79_131">
            <rect width="60" height="60" fill="white"/>
            </clipPath>
            </defs>
            </svg>
        </button>
          <button
            id="HeadFavorie"
            className="headButton"
            onClick={() => {
              if (!randomHeadIMG) return;
              const isFav = toggleFilmFavori(randomHeadIMG);
              setRandomFilm(prev => ({
                ...prev,
                favori: isFav,
                favorie: isFav,
              }));
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="FavorieButton"
              viewBox="0 0 41 41"
              fill="none"
            >
              <path
                d="M26.347 12.0074L22.0042 2.99257C21.2568 1.44102 19.0284 1.49675 18.3594 3.08372L14.6289 11.9337C14.3509 12.5933 13.7414 13.0541 13.031 13.1417L4.14202 14.2388C2.47553 14.4445 1.789 16.4881 2.99333 17.6582L9.96559 24.4322C10.4853 24.9371 10.6913 25.6837 10.5039 26.3837L7.76476 36.6185C7.31529 38.2979 9.07487 39.7116 10.618 38.9108L19.1596 34.4781C19.7372 34.1783 20.4245 34.1783 21.0021 34.4781L29.8046 39.0462C31.3054 39.825 33.0355 38.5056 32.6815 36.8522L30.4412 26.3889C30.2905 25.6849 30.5297 24.9543 31.0675 24.4759L38.6623 17.7193C39.9533 16.5708 39.2786 14.4362 37.5621 14.2382L27.9197 13.1262C27.2383 13.0476 26.6447 12.6254 26.347 12.0074Z"
                stroke="#D9D9D9"
                strokeWidth="3"
                fill={isFilmFavori(randomHeadIMG) ? "#D9D9D9" : "none"}
              />
            </svg>
            <u>{isFilmFavori(randomHeadIMG) ? "Retirer de la liste" : "Ajouter à la liste"}</u>
          </button>

        <span>{randomHeadIMG?.genre}</span>
      </div>
      )}

    </div>
    
  

    {/* Bannière d'aide si des données sont manquantes */}
    {incompleteCount > 0 && (
      <div className="incomplete-films-banner">
        <span className="banner-icon">⚠️</span>
        <span className="banner-text">
          <strong>Mode détection de données :</strong> {incompleteCount} film(s)/série(s) ont des informations manquantes. Cliquez sur une miniature pour afficher la liste des champs à compléter.
        </span>
      </div>
    )}

    {/* Section catalogue */}
    <div>
      <h3>catalogue</h3>
      <div className="swiper-container">
        <button className="catalogue-prev Portrait-nav">&lt;</button>
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.catalogue-next',
            prevEl: '.catalogue-prev',
          }}
          loop={displayedFilms.length > 8}
          loopAddBlankSlides={false}
          spaceBetween={16}
          speed={600}
          className="slider-swiper"
          breakpoints={{
            0: {
              slidesPerView: 2.2,
              slidesPerGroup: 2,
            },
            481: {
              slidesPerView: 3.2,
              slidesPerGroup: 3,
            },
            769: {
              slidesPerView: 4.2,
              slidesPerGroup: 4,
            },
            1025: {
              slidesPerView: 5.2,
              slidesPerGroup: 5,
            },
            1441: {
              slidesPerView: 6.2,
              slidesPerGroup: 6,
            },
          }}
        >
          {displayedFilms.map((film, index) => {
            const missing = getMissingFields(film);
            const portraitUrl = getImageUrl(film.miniPortrait) || getImageUrl(film.miniPaysage) || getImageUrl(film.affiche);
            const wt = getWatchtime(film);
            return (
              <SwiperSlide key={film.id || index}>
                <div className="miniatureportrait" onClick={() => setSelectedFilm(film)}>
                  {missing.length > 0 && (
                    <div className="card-missing-badge" title={`Champs à compléter : ${missing.join(', ')}`}>
                      <span>⚠️ {missing.length}</span>
                    </div>
                  )}
                  {portraitUrl ? (
                    <img
                      src={portraitUrl}
                      alt={`portrait de ${film.titre || 'film'}`}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className="card-fallback-placeholder" style={{ display: portraitUrl ? 'none' : 'flex' }}>
                    <span className="placeholder-icon">🎬</span>
                    <span className="placeholder-title">{film.titre || film.title || 'Sans titre'}</span>
                    <span className="placeholder-alert">⚠️ Image manquante</span>
                  </div>
                  {wt > 0 && (
                    <div className="card-progressbar">
                      <div
                        className="card-progressbar-fill"
                        style={{ width: `${wt}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <button className="catalogue-next Portrait-nav">&gt;</button>
      </div>
    </div>


      {/* Section reprendre */}
      <div>
        <h3>reprendre</h3>
        {shouldUseSlider ? (
          <div className="swiper-container">
            <button className="reprendre-prev Paysage-nav">&lt;</button>
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.reprendre-next',
                prevEl: '.reprendre-prev',
              }}
              loop={false}
              loopAddBlankSlides={false}
              spaceBetween={16}
              speed={600}
              className="slider-swiper"
              breakpoints={{
                0: {
                  slidesPerView: 1.2,
                  slidesPerGroup: 1,
                },
                481: {
                  slidesPerView: 2.2,
                  slidesPerGroup: 1,
                },
                769: {
                  slidesPerView: 3.2,
                  slidesPerGroup: 2,
                },
                1025: {
                  slidesPerView: 4.2,
                  slidesPerGroup: 3,
                },
                1441: {
                  slidesPerView: 5.2,
                  slidesPerGroup: 4,
                },
              }}
            >
              {filmsToResume.map((film, index) => {
                const missing = getMissingFields(film);
                const paysageUrl = getImageUrl(film.miniPaysage) || getImageUrl(film.miniPortrait) || getImageUrl(film.affiche);
                const wt = getWatchtime(film);
                return (
                  <SwiperSlide key={film.id || index}>
                    <div className="miniaturepaysage" onClick={() => setSelectedFilm(film)}>
                      {missing.length > 0 && (
                        <div className="card-missing-badge" title={`Champs à compléter : ${missing.join(', ')}`}>
                          <span>⚠️ {missing.length}</span>
                        </div>
                      )}
                      {paysageUrl ? (
                        <img
                          src={paysageUrl}
                          alt={`paysage de ${film.titre || 'film'}`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className="card-fallback-placeholder" style={{ display: paysageUrl ? 'none' : 'flex' }}>
                        <span className="placeholder-icon">🎬</span>
                        <span className="placeholder-title">{film.titre || film.title || 'Sans titre'}</span>
                        <span className="placeholder-alert">⚠️ Image manquante</span>
                      </div>
                      {wt > 0 && (
                        <div className="card-progressbar">
                          <div
                            className="card-progressbar-fill"
                            style={{ width: `${wt}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <button className="reprendre-next Paysage-nav">&gt;</button>
          </div>
        ) : ( 
          <div className='margin-section'>
              <div className="miniatures-paysage">
              {filmsToResume.map((film, index) => {
                const missing = getMissingFields(film);
                const paysageUrl = getImageUrl(film.miniPaysage) || getImageUrl(film.miniPortrait) || getImageUrl(film.affiche);
                const wt = getWatchtime(film);
                return (
                  <div key={film.id || index} className="miniaturepaysage" onClick={() => setSelectedFilm(film)}>
                    {missing.length > 0 && (
                      <div className="card-missing-badge" title={`Champs à compléter : ${missing.join(', ')}`}>
                        <span>⚠️ {missing.length}</span>
                      </div>
                    )}
                    {paysageUrl ? (
                      <img
                        src={paysageUrl}
                        alt={`paysage de ${film.titre || 'film'}`}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className="card-fallback-placeholder" style={{ display: paysageUrl ? 'none' : 'flex' }}>
                      <span className="placeholder-icon">🎬</span>
                      <span className="placeholder-title">{film.titre || film.title || 'Sans titre'}</span>
                      <span className="placeholder-alert">⚠️ Image manquante</span>
                    </div>
                    {wt > 0 && (
                      <div className="card-progressbar">
                        <div
                          className="card-progressbar-fill"
                          style={{ width: `${wt}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          </div>
          
        )}
      </div>

      {/* Section plus grand succès */}
      <div>
        <h3>plus grand succès</h3>
        <div className="swiper-container">
            <button className="succes-prev Paysage-nav">&lt;</button>
        <Swiper
          modules={[Navigation]}
            navigation={{
            nextEl: '.succes-next',
            prevEl: '.succes-prev',
          }}
          loop={false}
          loopAddBlankSlides={false}
          spaceBetween={16}
          speed={600}
          className="slider-swiper centred-swiper"
          breakpoints={{
            0: {
              slidesPerView: 1.8,
              slidesPerGroup: 1,
            },
            481: {
              slidesPerView: 2.8,
              slidesPerGroup: 2,
            },
            769: {
              slidesPerView: 3.8,
              slidesPerGroup: 3,
            },
            1025: {
              slidesPerView: 4.8,
              slidesPerGroup: 4,
            },
            1441: {
              slidesPerView: 5.8,
              slidesPerGroup: 5,
            },
          }}
        >
          {top10MostViewed.map((film, index) => {
            const missing = getMissingFields(film);
            const imgUrl = getImageUrl(isMobile ? (film.miniPortrait || film.affiche || film.miniPaysage) : (film.miniPaysage || film.miniPortrait || film.affiche));
            const wt = getWatchtime(film);
            return (
              <SwiperSlide key={film.id || index}>
                <div className={isMobile ? "miniahybride" : "miniaturepaysage"} onClick={() => setSelectedFilm(film)}>
                  {missing.length > 0 && (
                    <div className="card-missing-badge" title={`Champs à compléter : ${missing.join(', ')}`}>
                      <span>⚠️ {missing.length}</span>
                    </div>
                  )}
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={`image de ${film.titre || 'film'}`}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className="card-fallback-placeholder" style={{ display: imgUrl ? 'none' : 'flex' }}>
                    <span className="placeholder-icon">🎬</span>
                    <span className="placeholder-title">{film.titre || film.title || 'Sans titre'}</span>
                    <span className="placeholder-alert">⚠️ Image manquante</span>
                  </div>
                  {wt > 0 && (
                    <div className="card-progressbar">
                      <div
                        className="card-progressbar-fill"
                        style={{ width: `${wt}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <button className="succes-next Paysage-nav">&gt;</button>
        </div>
        
      </div>
    {/* Modal */}
    <Modal
      film={selectedFilm}
      onClose={() => setSelectedFilm(null)}
      allFilms={films}
      onSelectFilm={setSelectedFilm}
    />
  </div>
);

}
