import { doc, updateDoc } from "firebase/firestore";
import { db } from "./Firebaseconfig"; // chemin vers ton fichier config

/**
 * Inverse la valeur du champ "favori" pour un film donné
 * @param {string} filmId - L'ID du document Firestore
 * @param {boolean} currentFavori - Valeur actuelle de "favori"
 */
export async function toggleFavori(filmId, currentFavori) {
  try {
    const filmRef = doc(db, "films", filmId);
    await updateDoc(filmRef, {
      favori: !currentFavori,
    });
    console.log("Favori mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour de favori :", error);
  }
}
