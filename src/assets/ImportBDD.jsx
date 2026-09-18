import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebaseconfig";

export async function getFilmsFromBdd(timeoutMs = 4000) {
  try {
    const fetchPromise = (async () => {
      const filmsCol = collection(db, "films");
      const filmsSnapshot = await getDocs(filmsCol);
      return filmsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    })();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firestore timeout")), timeoutMs)
    );

    const result = await Promise.race([fetchPromise, timeoutPromise]);
    return Array.isArray(result) && result.length > 0 ? result : null;
  } catch (err) {
    console.warn("getFilmsFromBdd: fallback aux données locales suite à :", err?.message || err);
    return null;
  }
}