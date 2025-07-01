import films from './Filmlist'
import { useState, useEffect } from 'react'
import Modal from './modal'
import { useMediaQuery } from 'react-responsive';
import './Mainpage.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
export default function Home() {

  const [selectedFilm, setSelectedFilm] = useState(null)

   const isMobile = useMediaQuery({ maxWidth: 768 });
  

  const top10MostViewed = [...films]
    .sort((a, b) => b.view - a.view)
    .slice(0, 10);

  const filmsToResume = films.filter(film => {
    const type = film.type?.toLowerCase(); // sécurise et force en minuscules
    const isFilmWithProgress = type === 'film' && film.watchtime > 5 && film.watchtime < 90;

    const isSerieWithProgress =
      type === 'serie' &&
      Array.isArray(film.saison) &&
      film.saison.some(s =>
        Array.isArray(s.episodes) &&
        s.episodes.some(ep => ep.watchtime > 5 && ep.watchtime < 90)
      );
      
    return isFilmWithProgress || isSerieWithProgress;
});

 const shouldUseSlider = filmsToResume.length > 5 || (isMobile && filmsToResume.length > 2)
// Sélection aléatoire d'une image "Paysage"
  const [randomHeadIMG, setRandomFilm] = useState(null);
  const filmsWithPaysage = films.filter(f => f.miniPaysage);

  useEffect(() => {
    const film = filmsWithPaysage[Math.floor(Math.random() * filmsWithPaysage.length)];
    setRandomFilm(film);
  }, []);


return (
  <div className='container-fluid mt-5'>
    <div className='headpage'>
      {randomHeadIMG && (
        <img
          src={`/minia/${isMobile ? randomHeadIMG.miniPortrait : randomHeadIMG.miniPaysage}`}
          alt="image d'accueil aléatoire"
          className="headpageIMG"
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
            <path d="M30 2.50001C24.561 2.50001 19.2442 4.11286 14.7218 7.1346C10.1995 10.1563 6.67474 14.4513 4.59333 19.4762C2.51192 24.5012 1.96732 30.0305 3.02842 35.365C4.08951 40.6995 6.70863 45.5995 10.5546 49.4454C14.4005 53.2914 19.3006 55.9105 24.635 56.9716C29.9695 58.0327 35.4988 57.4881 40.5238 55.4067C45.5488 53.3253 49.8437 49.8005 52.8654</g> 45.2782C55.8872 40.7558 57.5 35.439 57.5 30C57.5166 26.384 56.8166 22.8006 55.4404 19.4567C54.0643 16.1127 52.0393 13.0746 49.4823 10.5177C46.9254 7.96076 43.8873 5.93576 40.5434 4.55962C37.1994 3.18347 33.616 2.48346 30 2.50001ZM32.5 42.5C32.5 43.1631 32.2366 43.7989 31.7678 44.2678C31.2989 44.7366 30.6631 45 30 45C29.337 45 28.7011 44.7366 28.2322 44.2678C27.7634 43.7989 27.5 43.1631 27.5 42.5V27.5C27.5 26.837 27.7634 26.2011 28.2322 25.7322C28.7011 25.2634 29.337 25 30 25C30.6631 25 31.2989 25.2634 31.7678 25.7322C32.2366 26.2011 32.5 26.837 32.5 27.5V42.5ZM30 20C29.5056 20 29.0222 19.8534 28.6111 19.5787C28.2 19.304 27.8795 18.9135 27.6903 18.4567C27.5011 17.9999 27.4516 17.4972 27.548 17.0123C27.6445 16.5273 27.8826 16.0819 28.2322 15.7322C28.5819 15.3826 29.0273 15.1445 29.5123 15.048C29.9972 14.9516 30.4999 15.0011 30.9567 15.1903C31.4135 15.3795 31.804 15.7 32.0787 16.1111C32.3534 16.5222 32.5 17.0056 32.5 17.5C32.5 18.1631 32.2366 18.7989 31.7678 19.2678C31.2989 19.7366 30.6631 20 30 20Z" fill="#D9D9D9"/>
            </g>
            <rect x="0.5" y="0.5" width="59" height="59" stroke="#D9D9D9"/>
            <defs>
            <clipPath id="clip0_79_131">
            <rect width="60" height="60" fill="white"/>
            </clipPath>
            </defs>
            </svg>
        </button>
          <button id='HeadFavorie' className='headButton'  onClick={() => {
            if (!randomHeadIMG) return;
            setRandomFilm(prev => ({
              ...prev,
              favorie: !prev.favorie
            }));
          }} > 
          <svg xmlns="http://www.w3.org/2000/svg" className='FavorieButton'  viewBox="0 0 41 41" fill="none">
          <path 
                d="M26.347 12.0074L22.0042 2.99257C21.2568 1.44102 19.0284 1.49675 18.3594 3.08372L14.6289 11.9337C14.3509 12.5933 13.7414 13.0541 13.031 13.1417L4.14202 14.2388C2.47553 14.4445 1.789 16.4881 2.99333 17.6582L9.96559 24.4322C10.4853 24.9371 10.6913 25.6837 10.5039 26.3837L7.76476 36.6185C7.31529 38.2979 9.07487 39.7116 10.618 38.9108L19.1596 34.4781C19.7372 34.1783 20.4245 34.1783 21.0021 34.4781L29.8046 39.0462C31.3054 39.825 33.0355 38.5056 32.6815 36.8522L30.4412 26.3889C30.2905 25.6849 30.5297 24.9543 31.0675 24.4759L38.6623 17.7193C39.9533 16.5708 39.2786 14.4362 37.5621 14.2382L27.9197 13.1262C27.2383 13.0476 26.6447 12.6254 26.347 12.0074Z"
                stroke="#D9D9D9"
                strokeWidth="3"
                fill={randomHeadIMG?.favorie ? "#D9D9D9" : "none"}
          />
          </svg>  <u>Ajouter a la liste</u> 
        </button>
        <span>{randomHeadIMG?.genre}</span>
      </div>
      )}

    </div>
    
  

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
          loop={true}
          spaceBetween={12}
          speed={900}
          className="slider-swiper"
           breakpoints={{
              0: {
                slidesPerView: 1.1,
                slidesPerGroup: 1,
              },
              376: {
                slidesPerView: 1.2,
                slidesPerGroup: 1,
              },
              481: {
                slidesPerView: 2.2,
                slidesPerGroup: 2,
              },
              769: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              1025: {
                slidesPerView: 4.2,
                slidesPerGroup: 4,
              },
              1441: {
                slidesPerView: 5.5,
                slidesPerGroup: 6,
              },
            }}
        >
          {films.map((film, index) => (
            <SwiperSlide key={index}>
              <div className="miniatureportrait">
                <img
                  src={`/minia/${film.miniPortrait}`}
                  alt={`portrait de ${film.titre}`}
                  onClick={() => setSelectedFilm(film)}
                />
              </div>
            </SwiperSlide>
          ))}
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
              loop={true}
              spaceBetween={12}
          slidesPerView={isMobile ? 2.3 : 5}
          slidesPerGroup={isMobile ? 2 : 5}
              speed={900}
              className="slider-swiper"
              breakpoints={{
              0: {

                slidesPerView: 1.12,
                slidesPerGroup: 1,
              },
              376: {

                slidesPerView: 1.5,
                slidesPerGroup: 1,
              },
              481: {
                slidesPerView: 2.3,
                slidesPerGroup: 2,
              },
              769: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              1025: {
                slidesPerView: 4.2,
                slidesPerGroup: 4,
              },
              1441: {
                slidesPerView: 5,
                slidesPerGroup: 5,
              },
            }}
            >
              {filmsToResume.map((film, index) => (
                <SwiperSlide key={index}>
                  <div className="miniaturepaysage">
                    <img
                      src={`/minia/${film.miniPaysage}`}
                      alt={`paysage de ${film.titre}`}
                      onClick={() => setSelectedFilm(film)}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="reprendre-next Paysage-nav">&gt;</button>
          </div>
        ) : ( 
          <div className='margin-section'>
              <div className="miniatures-paysage">
              {filmsToResume.map((film, index) => (
                <div key={index} className="miniaturepaysage">
                  <img
                    src={`/minia/${film.miniPaysage}`}
                    alt={`paysage de ${film.titre}`}
                    onClick={() => setSelectedFilm(film)}
                  />
                </div>
              ))}
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
          loop={true}
          spaceBetween={12}
          speed={900}
          className="slider-swiper centred-swiper"
          breakpoints={{
              0: {
                // slidesPerView: 4,
                // slidesPerGroup: 4,
                slidesPerView: 2.2,
                slidesPerGroup: 2,
              },
              376: {
                slidesPerView: 2.5
                ,
                slidesPerGroup: 2,
              },
        
              481: {
                slidesPerView: 4.15,
                slidesPerGroup: 4,
              },
        
              769: {
                slidesPerView: 4.5,
                slidesPerGroup: 4,
              },

            }}
        >
          {top10MostViewed.map((film, index) => (
            <SwiperSlide key={index}>
              <div className={isMobile ? "miniahybride" : "miniaturepaysage"}>
                <img
                  src={`/minia/${isMobile ? film.miniPortrait : film.miniPaysage}`}
                  alt={`image de ${film.titre}`}
                  onClick={() => setSelectedFilm(film)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="succes-next Paysage-nav">&gt;</button>
        </div>
        
      </div>
    {/* Modal */}
    <Modal film={selectedFilm} onClose={() => setSelectedFilm(null)} />
  </div>
);

}