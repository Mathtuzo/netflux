import { useEffect, useState } from "react";
import Modal from "../modal/Modal"
import films from "../../assets/Filmlist";

function Favori() {
  const [favoriData, setFavoriData] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadFavoris = () => {
    const favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    setFavoriData(favoris);
  };

  useEffect(() => {
    loadFavoris();
  }, []);

  const getFullFilmData = (title) => {
    return films.find(f => f.titre.toLowerCase() === title.toLowerCase());
  };

  const handleCardClick = (favori) => {
    const fullFilm = getFullFilmData(favori.Title);
    if (fullFilm) {
      setSelectedFilm(fullFilm);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFilm(null);
    loadFavoris();
  };

  
  

  return (
    <div id="favori-content">
      {favoriData.length === 0 ? (<p>Aucun favori pour le moment.</p>) : (
        favoriData.map((item) => (
          <div key={item.Title} className="favori-cards" onClick={() => handleCardClick(item)}>
            <img src={`minia/${item.img}`} alt={item.Title}/>
          </div>
        ))
      )}

      {isModalOpen && selectedFilm && (<Modal film={selectedFilm} onClose={handleCloseModal} onFavorisUpdate={loadFavoris}/>)}
    </div>
  );
}

export default Favori;