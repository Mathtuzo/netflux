import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebaseconfig";

export async function getFilmsFromBdd() {
  const filmsCol = collection(db, "films"); // Nom de ta collection
  const filmsSnapshot = await getDocs(filmsCol);
  const filmsList = filmsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return filmsList;
}