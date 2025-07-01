import { useEffect, useState } from "react";
import films from "../../assets/Filmlist";  
import play from "../../assets/svg/play.svg";
import suppr from "../../assets/svg/suppr.svg";

function Downloads() {
  const [downloadData, setDownloadData] = useState([]);

 
  const loadDownloads = () => {
    const downloads = JSON.parse(localStorage.getItem("downloads")) || [];
    
    const fullDownloads = downloads
      .map(dl => films.find(f => f.titre.toLowerCase() === dl.Title.toLowerCase())).filter(Boolean);  
    setDownloadData(fullDownloads);
  };

  useEffect(() => {
    loadDownloads();
  }, []);

  const playClicked = (film) => {
    console.log("Lecture de l'élément", film.titre);
  };

  const supprClicked = (filmToRemove) => {
    console.log("Suppression de l'élément des téléchargements", filmToRemove.titre);

    let downloads = JSON.parse(localStorage.getItem("downloads")) || [];
    downloads = downloads.filter(dl => dl.Title !== filmToRemove.titre);
    localStorage.setItem("downloads", JSON.stringify(downloads));
    
    loadDownloads();
  };

  return (
    <div id="dl-content">
      {downloadData.length === 0 ? (<p>Aucun téléchargement pour le moment.</p>) : (
        downloadData.map((item, index) => (
          <div key={index} className="dl-cards">
            <img src={`minia/${item.miniPortrait}`} alt={item.titre} className="dl-element-img" />
            <div className="dl-text">
              <p>{item.titre}</p>
              <p className="dl-description">{item.synopsis || item.description || "Pas de description"}</p>
            </div>
            <div className="dl-actions">
                <button className="dl-btn dl-btn-play" onClick={() => playClicked(item)}>
                    <img src={play} alt="bouton lecture" />
                </button>
                <button className="dl-btn dl-btn-suppr" onClick={() => supprClicked(item)}>
                    <img src={suppr} alt="bouton supprimer" />
                </button>
            </div>
            
          </div>
        ))
      )}
    </div>
  );
}

export default Downloads;