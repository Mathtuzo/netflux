/**
 * Gestion centralisée des Favoris et Téléchargements Netflux (localStorage + Firestore).
 */
import { toggleFavori as updateBddFavori } from "./UpdateBDD.jsx";

export const EVENT_FAVORIS_UPDATED = 'netflux-favoris-updated';
export const EVENT_DOWNLOADS_UPDATED = 'netflux-downloads-updated';

/**
 * Normalise un titre de film pour comparaison
 */
function getNormalizedTitle(film) {
  if (!film) return '';
  return String(film.titre || film.title || film.Title || '').trim().toLowerCase();
}

/**
 * Récupère la liste brute des favoris depuis le localStorage
 */
export function getStoredFavoris() {
  try {
    const data = JSON.parse(localStorage.getItem("favoris")) || [];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erreur lecture localStorage favoris:", err);
    return [];
  }
}

/**
 * Récupère la liste brute des téléchargements depuis le localStorage
 */
export function getStoredDownloads() {
  try {
    const data = JSON.parse(localStorage.getItem("downloads")) || [];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erreur lecture localStorage downloads:", err);
    return [];
  }
}

/**
 * Vérifie si un film est dans les favoris
 */
export function isFilmFavori(film) {
  if (!film) return false;
  const targetTitle = getNormalizedTitle(film);
  if (!targetTitle) return false;

  const favoris = getStoredFavoris();
  const existsInStorage = favoris.some(fav => getNormalizedTitle(fav) === targetTitle);
  if (existsInStorage) return true;

  // Si explicitement retiré de storage mais true dans l'objet film, on respecte le storage
  // Si le storage a déjà été initialisé au moins une fois
  if (localStorage.getItem("favoris") !== null) {
    return false;
  }

  return Boolean(film.favori === true || film.favorie === true);
}

/**
 * Ajoute ou retire un film des favoris
 * @returns {boolean} true si le film est maintenant favori, false sinon
 */
export function toggleFilmFavori(film) {
  if (!film) return false;
  const title = film.titre || film.title || film.Title;
  if (!title) return false;

  const targetTitle = getNormalizedTitle(film);
  let favoris = getStoredFavoris();
  const exists = favoris.some(fav => getNormalizedTitle(fav) === targetTitle);

  let isFavoriNow = false;

  if (exists) {
    favoris = favoris.filter(fav => getNormalizedTitle(fav) !== targetTitle);
    isFavoriNow = false;
  } else {
    favoris.push({
      Title: title,
      titre: title,
      img: film.miniPortrait || film.miniPaysage || film.affiche || '',
      miniPortrait: film.miniPortrait || film.affiche || film.miniPaysage || '',
      miniPaysage: film.miniPaysage || film.miniPortrait || '',
      affiche: film.affiche || '',
      genre: film.genre || '',
      annee: film.annee || '',
      duree: film.duree || '',
      restriction: film.restriction || '+12',
      synopsis: film.synopsis || film.description || '',
      id: film.id || null,
      type: film.type || 'Film'
    });
    isFavoriNow = true;
  }

  try {
    localStorage.setItem("favoris", JSON.stringify(favoris));
  } catch (e) {
    console.error("Erreur écriture localStorage favoris:", e);
  }

  // Mettre à jour l'objet en mémoire
  film.favori = isFavoriNow;
  film.favorie = isFavoriNow;

  // Synchronisation Firestore si un ID document existe
  if (film.id) {
    try {
      updateBddFavori(film.id, !isFavoriNow);
    } catch (e) {
      console.warn("Synchronisation Firestore impossible:", e);
    }
  }

  // Notifier tous les composants de l'application
  window.dispatchEvent(new CustomEvent(EVENT_FAVORIS_UPDATED, {
    detail: { film, isFavori: isFavoriNow }
  }));

  return isFavoriNow;
}

/**
 * Vérifie si un film est dans la liste des téléchargements
 */
export function isFilmDownloaded(film) {
  if (!film) return false;
  const targetTitle = getNormalizedTitle(film);
  if (!targetTitle) return false;

  const downloads = getStoredDownloads();
  const existsInStorage = downloads.some(dl => getNormalizedTitle(dl) === targetTitle);
  if (existsInStorage) return true;

  if (localStorage.getItem("downloads") !== null) {
    return false;
  }

  return Boolean(film.download === true || film.downloaded === true);
}

/**
 * Ajoute ou retire un film des téléchargements
 * @returns {boolean} true si le film est maintenant téléchargé, false sinon
 */
export function toggleFilmDownload(film) {
  if (!film) return false;
  const title = film.titre || film.title || film.Title;
  if (!title) return false;

  const targetTitle = getNormalizedTitle(film);
  let downloads = getStoredDownloads();
  const exists = downloads.some(dl => getNormalizedTitle(dl) === targetTitle);

  let isDownloadedNow = false;

  if (exists) {
    downloads = downloads.filter(dl => getNormalizedTitle(dl) !== targetTitle);
    isDownloadedNow = false;
  } else {
    downloads.push({
      Title: title,
      titre: title,
      img: film.miniPortrait || film.miniPaysage || film.affiche || '',
      miniPortrait: film.miniPortrait || film.affiche || film.miniPaysage || '',
      miniPaysage: film.miniPaysage || film.miniPortrait || '',
      affiche: film.affiche || '',
      genre: film.genre || '',
      annee: film.annee || '',
      duree: film.duree || '',
      restriction: film.restriction || '+12',
      synopsis: film.synopsis || film.description || '',
      id: film.id || null,
      type: film.type || 'Film'
    });
    isDownloadedNow = true;
  }

  try {
    localStorage.setItem("downloads", JSON.stringify(downloads));
  } catch (e) {
    console.error("Erreur écriture localStorage downloads:", e);
  }

  // Mettre à jour l'objet en mémoire
  film.download = isDownloadedNow;
  film.downloaded = isDownloadedNow;

  // Notifier tous les composants de l'application
  window.dispatchEvent(new CustomEvent(EVENT_DOWNLOADS_UPDATED, {
    detail: { film, isDownloaded: isDownloadedNow }
  }));

  return isDownloadedNow;
}
