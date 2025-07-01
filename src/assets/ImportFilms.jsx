import React, { useEffect } from 'react';
import { db } from './Firebaseconfig';
import films from './Filmlist';
import { collection, addDoc } from 'firebase/firestore';

const ImportFilms = () => {
  useEffect(() => {
    const importData = async () => {
      const colRef = collection(db, 'films');
      for (const film of films) {
        try {
          await addDoc(colRef, film);
          console.log(`✅ Ajouté : ${film.titre}`);
        } catch (error) {
          console.error('❌ Erreur ajout', error);
        }
      }
    };

    importData();
  }, []);

  return <div>📦 Importation en cours...</div>;
};

// export default ImportFilms;