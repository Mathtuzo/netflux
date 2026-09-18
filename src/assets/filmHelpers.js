/**
 * Utilitaires pour la gestion, la normalisation et la détection des données manquantes des films/séries.
 */

// Résout les URLs d'images (locales /minia/, absolues, ou distantes Firebase/https)
export function getImageUrl(path, defaultFolder = 'minia') {
  if (!path || typeof path !== 'string') return null;
  const trimmed = path.replace(/^["'\s]+|["'\s]+$/g, '').trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  return `/${defaultFolder}/${trimmed}`;
}

// Détermine le dossier d'épisodes correspondant au titre de la série dans /public/minia/epSerie/
export function getSerieFolder(titre) {
  if (!titre || typeof titre !== 'string') return 'Southpark';
  const t = titre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (t.includes('viking')) return 'Vikings';
  if (t.includes('south')) return 'Southpark';
  if (t.includes('breaking')) return 'Breakingbad';
  if (t.includes('throne') || t.includes('got')) return 'GOT';
  if (t.includes('dragon') || t.includes('hotd')) return 'HOTD';
  if (t.includes('andor')) return 'Andor';
  if (t.includes('naruto')) return 'Naruto';
  if (t.includes('dar')) return 'Dardevil';
  if (t.includes('stranger')) return 'StrangerThings';
  if (t.includes('office')) return 'TheOffice';
  if (t.includes('crown')) return 'TheCrown';
  if (t.includes('ginny') || t.includes('georgia')) return 'GinnyAndGeorgia';
  if (t.includes('you')) return 'You';
  if (t.includes('wire')) return 'TheWire';
  if (t.includes('sail')) return 'BlackSails';
  if (t.includes('doctor') || t.includes('who')) return 'DoctorWho';
  if (t.includes('arcane')) return 'Arcane';
  return titre.replace(/[^a-zA-Z0-9]/g, '');
}

// Nettoie le nom de fichier de l'épisode (retire guillemets résiduels, \n, et ajoute .png si manquant)
export function cleanEpisodeMinia(minia) {
  if (!minia || typeof minia !== 'string') return '';
  let clean = minia.replace(/^["'\s]+|["'\s]+$/g, '').trim();
  if (clean && !/\.[a-zA-Z0-9]{3,4}$/.test(clean)) {
    clean = `${clean}.png`;
  }
  return clean;
}

// Renvoie l'URL de la miniature d'un épisode pour une série donnée
export function getEpisodeImageUrl(epMinia, filmTitre) {
  const clean = cleanEpisodeMinia(epMinia);
  if (!clean) return null;
  const folder = getSerieFolder(filmTitre);
  return `/minia/epSerie/${folder}/${clean}`;
}

// Vérifie si un champ texte est vide ou contient des pointillés de placeholder
export function isPlaceholderOrEmpty(val) {
  if (val === null || val === undefined) return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val !== 'string') return false;
  const t = val.trim();
  if (t === '') return true;
  if (t.replace(/\./g, '').trim() === '') return true; // ex: "..........."
  return false;
}

// Formate la durée intelligemment (qu'elle soit numérique en minutes ou chaîne '2h15')
export function formatDuration(duree) {
  if (!duree) return null;
  if (typeof duree === 'string' && duree.trim()) return duree;
  const num = Number(duree);
  if (isNaN(num) || num <= 0) return null;
  if (num < 60) return `${num} min`;
  const hours = Math.floor(num / 60);
  const mins = num % 60;
  return mins > 0 ? `${hours}h${mins < 10 ? '0' : ''}${mins}` : `${hours}h`;
}

// Détecte précisément toutes les données manquantes d'un film ou d'une série
export function getMissingFields(film) {
  if (!film) return ['Fiche vide'];
  const missing = [];

  // Titre
  if (!film.titre && !film.title && !film.name) {
    missing.push('titre');
  }

  // Type (Film ou Série)
  if (!film.type) {
    missing.push('type (Film / Serie)');
  }

  const isSerie = (film.type && film.type.toLowerCase().includes('serie')) || Array.isArray(film.saison) || Array.isArray(film.episodes) || Boolean(film.saisons);

  // Images
  if (!film.miniPortrait && !film.portrait && !film.poster && !film.image && !film.affiche) {
    missing.push('miniPortrait (affiche)');
  }
  if (!film.miniPaysage && !film.paysage && !film.cover && !film.backdrop) {
    missing.push('miniPaysage (bannière)');
  }
  if (!film.titleIMG && !film.logo) {
    missing.push('titleIMG (logo titre)');
  }

  // Infos générales
  if (isPlaceholderOrEmpty(film.genre)) {
    missing.push('genre');
  }
  if (!film.annee && !film.year) {
    missing.push('annee');
  }
  if (isPlaceholderOrEmpty(film.synopsis) && isPlaceholderOrEmpty(film.description)) {
    missing.push('synopsis');
  }
  if (!film.restriction) {
    missing.push('restriction (ex: +12)');
  }
  if (!film.resolutionmax) {
    missing.push('resolutionmax (ex: 4K, HD)');
  }

  // Équipe
  if (isPlaceholderOrEmpty(film.realisation)) {
    missing.push('realisation');
  }
  if (isPlaceholderOrEmpty(film.distribution)) {
    missing.push('distribution');
  }

  // Spécifique Film vs Série
  if (!isSerie) {
    if (!film.duree && !film.duration) {
      missing.push('duree');
    }
  } else {
    const seasons = film.saison || film.episodes;
    if ((!Array.isArray(seasons) || seasons.length === 0) && !film.saisons) {
      missing.push('saison (épisodes)');
    }
  }

  return missing;
}

// Filtre tolérant pour type (ne jette pas les films sans type ou avec fautes d'accents/pluriel)
export function isTypeMatch(filmType, filter) {
  if (!filter || filter === 'all') return true;
  if (!filmType || typeof filmType !== 'string') return false;
  const norm = filmType.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const filterNorm = typeof filter === 'string' ? filter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() : '';
  return norm.startsWith(filterNorm) || filterNorm.startsWith(norm) || norm.includes(filterNorm);
}


// Calcule les films/séries similaires par titre, univers/franchise croisée, thèmes (genres), mots-clés et distribution/réalisation
export function getSimilarFilms(currentFilm, allFilms, limit = 6) {
  if (!currentFilm || !Array.isArray(allFilms) || allFilms.length === 0) return [];

  const currentTitre = (currentFilm.titre || currentFilm.title || '').trim().toLowerCase();

  // Exclure le film en cours de consultation
  const candidates = allFilms.filter(f => {
    if (!f) return false;
    if (f.id && currentFilm.id && f.id === currentFilm.id) return false;
    const t = (f.titre || f.title || '').trim().toLowerCase();
    return t !== currentTitre;
  });

  const normalizeTokens = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.flatMap(item => normalizeTokens(item));
    }
    return String(val)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[,/|\n\r;:]+/)
      .map(s => s.trim())
      .filter(s => s.length >= 2);
  };

  const getSignificantWords = (str) => {
    if (!str) return [];
    const stopWords = new Set([
      'avec', 'dans', 'pour', 'plus', 'sans', 'tout', 'tous', 'film', 'serie', 
      'the', 'and', 'les', 'des', 'une', 'qui', 'par', 'sur', 'aux', 'est', 
      'son', 'ses', 'ces', 'cet', 'cette', 'partie', 'vol', 'volume', 'saison'
    ]);
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[^a-z0-9]+/)
      .filter(w => w.length >= 3 && !stopWords.has(w));
  };

  // Normalisation des noms de personnes (nom complet ou nom de famille exact)
  const normalizePeople = (val) => {
    const list = normalizeTokens(val);
    return list.map(name => {
      const parts = name.split(/\s+/).filter(Boolean);
      return {
        full: parts.join(' '),
        lastName: parts.length > 1 ? parts[parts.length - 1] : parts[0],
        firstName: parts.length > 1 ? parts[0] : ''
      };
    }).filter(p => p.full.length >= 3);
  };

  const currentGenres = normalizeTokens(currentFilm.genre);
  const currentKeywords = normalizeTokens(currentFilm.keyword);
  const currentCast = normalizePeople(currentFilm.distribution);
  const currentDirectors = normalizePeople(currentFilm.realisation);
  const currentTitleWords = getSignificantWords(currentFilm.titre || currentFilm.title);
  const currentTitleRaw = String(currentFilm.titre || currentFilm.title || '').toLowerCase();

  const scored = candidates.map(film => {
    let score = 0;
    const matchReasons = [];

    // 1. Même type (Film ou Série)
    if (film?.type && currentFilm?.type && typeof film.type === 'string' && typeof currentFilm.type === 'string' && film.type.toLowerCase() === currentFilm.type.toLowerCase()) {
      score += 1;
    }

    // 2. Proximité directe des Titres (Sagas, suites, spin-offs, ex: Star Wars, Le Parrain)
    const filmTitleWords = getSignificantWords(film.titre || film.title);
    const filmTitleRaw = String(film.titre || film.title || '').toLowerCase();
    const commonTitleWords = currentTitleWords.filter(w => filmTitleWords.includes(w));
    if (commonTitleWords.length > 0) {
      score += commonTitleWords.length * 10;
      matchReasons.push('Saga / Titre commun');
    }

    // 3. Univers / Franchise croisée : Titre de l'un présent dans les Mots-clés de l'autre
    // Ex: "Star Wars" dans les mots-clés d'Andor et dans le titre de Star Wars 5
    const filmKeywords = normalizeTokens(film.keyword);
    
    currentKeywords.forEach(kw => {
      if (kw.length >= 3) {
        if (filmTitleRaw.includes(kw) || filmTitleWords.includes(kw)) {
          score += 16;
          matchReasons.push('Univers / Franchise');
        }
      }
    });
    filmKeywords.forEach(kw => {
      if (kw.length >= 3) {
        if (currentTitleRaw.includes(kw) || currentTitleWords.includes(kw)) {
          score += 16;
          matchReasons.push('Univers / Franchise');
        }
      }
    });

    // 4. Mots-clés communs (avec tolérance sur les racines ex: rebel/rebelles/rebellion)
    let kwMatchCount = 0;
    currentKeywords.forEach(ck => {
      const ckStem = ck.length > 5 ? ck.slice(0, 5) : ck;
      const found = filmKeywords.some(fk => {
        if (fk === ck) return true;
        if (ck.length >= 4 && fk.length >= 4 && (fk.includes(ck) || ck.includes(fk))) return true;
        const fkStem = fk.length > 5 ? fk.slice(0, 5) : fk;
        if (ckStem.length >= 5 && ckStem === fkStem) return true;
        return false;
      });
      if (found) {
        kwMatchCount++;
      }
    });
    if (kwMatchCount > 0) {
      score += kwMatchCount * 5;
      matchReasons.push('Mots-clés');
    }

    // 5. Thèmes et Genres
    const filmGenres = normalizeTokens(film.genre);
    let genreMatchCount = 0;
    currentGenres.forEach(cg => {
      if (filmGenres.some(fg => fg.includes(cg) || cg.includes(fg))) {
        genreMatchCount++;
      }
    });
    if (genreMatchCount > 0) {
      score += genreMatchCount * 4;
      matchReasons.push('Genre');
    }

    // 6. Distribution (Personnes réelles : nom complet OU nom de famille avec au moins 4 lettres ET même initiale prénom)
    const filmCast = normalizePeople(film.distribution);
    let castMatchCount = 0;
    currentCast.forEach(cp => {
      const match = filmCast.some(fp => {
        if (cp.full === fp.full) return true;
        if (cp.lastName && fp.lastName && cp.lastName.length >= 4 && cp.lastName === fp.lastName) {
          if (!cp.firstName || !fp.firstName || cp.firstName[0] === fp.firstName[0]) {
            return true;
          }
        }
        return false;
      });
      if (match) {
        castMatchCount++;
      }
    });
    if (castMatchCount > 0) {
      score += castMatchCount * 8;
      matchReasons.push('Casting');
    }

    // 7. Réalisation (Personnes réelles : nom complet obligatoire ou nom de famille >= 4 lettres + même prénom)
    const filmDirectors = normalizePeople(film.realisation);
    let directorMatchCount = 0;
    currentDirectors.forEach(dp => {
      const match = filmDirectors.some(fp => {
        if (dp.full === fp.full) return true;
        if (dp.lastName && fp.lastName && dp.lastName.length >= 4 && dp.lastName === fp.lastName && dp.firstName === fp.firstName) {
          return true;
        }
        return false;
      });
      if (match) {
        directorMatchCount++;
      }
    });
    if (directorMatchCount > 0) {
      score += directorMatchCount * 9;
      matchReasons.push('Réalisateur');
    }

    return { film, score, matchReasons };
  });

  // Tri décroissant par score de pertinence, puis popularité (views)
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (Number(b.film.view) || 0) - (Number(a.film.view) || 0);
  });

  return scored.slice(0, limit).map(item => item.film);
}

// Liste canonique des genres principaux avec variantes lexicales, singulier/pluriel et racines
export const CANONICAL_GENRES = [
  { id: 'action', label: 'Action', matches: ['action'] },
  { id: 'aventure', label: 'Aventure', matches: ['aventur', 'adventure'] },
  { id: 'science-fiction', label: 'Science-Fiction', matches: ['science-fiction', 'science fiction', 'sci-fi'] },
  { id: 'drame', label: 'Drame', matches: ['drame', 'drama', 'tragedie', 'tragédie'] },
  { id: 'comedie', label: 'Comédie', matches: ['comedie', 'comédie', 'sitcom', 'slapstick', 'humour'] },
  { id: 'crime', label: 'Crime / Policier', matches: ['crime', 'policier', 'gangster', 'mafia'] },
  { id: 'thriller', label: 'Thriller', matches: ['thriller'] },
  { id: 'fantasy', label: 'Fantasy', matches: ['fantasy', 'fantastique'] },
  { id: 'animation', label: 'Animation', matches: ['animation', 'anime', 'shonen'] },
  { id: 'super-heros', label: 'Super-héros', matches: ['super-heros', 'super-héros', 'superheros'] },
  { id: 'guerre-histoire', label: 'Guerre / Histoire', matches: ['guerre', 'histoire', 'historique'] },
  { id: 'epique', label: 'Épique', matches: ['epique', 'épique'] },
  { id: 'biopic', label: 'Biopic / Biographie', matches: ['biopic', 'biographi', 'biographique'] },
  { id: 'espionnage', label: 'Espionnage', matches: ['espionnage'] },
  { id: 'horreur', label: 'Horreur', matches: ['horreur'] },
  { id: 'famille', label: 'Famille / Jeunesse', matches: ['famille', 'jeunesse'] },
];

// Vérifie la correspondance d'un film avec un genre de filtre (insensible à la casse, accents, singulier/pluriel)
export function matchGenreFilter(filmGenre, targetGenre) {
  if (!targetGenre || targetGenre === 'Tous') return true;
  if (!filmGenre) return false;

  const normFilm = String(filmGenre)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // 1. Chercher si targetGenre correspond à l'un des genres canoniques
  const targetLower = String(targetGenre).toLowerCase().trim();
  const canonical = CANONICAL_GENRES.find(cg =>
    cg.label.toLowerCase() === targetLower ||
    cg.id.toLowerCase() === targetLower ||
    cg.matches.some(m => targetLower.includes(m) || m.includes(targetLower))
  );

  if (canonical) {
    return canonical.matches.some(pattern => {
      const p = pattern.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normFilm.includes(p);
    });
  }

  // 2. Fallback tolérant sur la racine (ex: 'aventur' pour 'aventures' et 'aventure')
  const normTarget = String(targetGenre)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const stem = normTarget.length > 5 ? normTarget.slice(0, 5) : normTarget;
  return normFilm.includes(normTarget) || (stem.length >= 4 && normFilm.includes(stem));
}

// Moteur de recherche avancé multi-champs (titre, acteur, réalisateur, genre, mots-clés, synopsis)
export function searchFilms(query, films, options = {}) {
  if (!Array.isArray(films) || films.length === 0) return [];
  if (!query || typeof query !== 'string' || !query.trim()) {
    let list = films;
    if (options.type) {
      list = list.filter(f => isTypeMatch(f.type, options.type));
    }
    if (options.genre && options.genre !== 'Tous') {
      list = list.filter(f => matchGenreFilter(f.genre, options.genre));
    }
    return list;
  }

  const cleanQuery = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const queryTerms = cleanQuery
    .split(/[^a-z0-9]+/)
    .filter(t => (cleanQuery.length <= 2 ? t.length >= 1 : t.length >= 2));

  const normalize = (val) => {
    if (!val) return '';
    return String(val)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  const results = [];

  for (const film of films) {
    if (!film) continue;

    // Filtre de type optionnel (film ou serie)
    if (options.type && !isTypeMatch(film.type, options.type)) {
      continue;
    }

    // Filtre de genre optionnel
    if (options.genre && options.genre !== 'Tous') {
      if (!matchGenreFilter(film.genre, options.genre)) {
        continue;
      }
    }

    const titleNorm = normalize(film.titre || film.title);
    const keywordsNorm = normalize(film.keyword);
    const castNorm = normalize(film.distribution);
    const realNorm = normalize(film.realisation);
    const genreNorm = normalize(film.genre);
    const synopsisNorm = normalize(film.synopsis || film.description);

    let score = 0;
    let matched = false;

    // 1. Match direct sur le titre entier
    if (titleNorm === cleanQuery) {
      score += 100;
      matched = true;
    } else if (titleNorm.startsWith(cleanQuery)) {
      score += 50;
      matched = true;
    } else if (titleNorm.includes(cleanQuery)) {
      score += 35;
      matched = true;
    }

    // 2. Analyse des termes individuels
    let termsMatched = 0;
    for (const term of queryTerms) {
      let termHit = false;

      if (titleNorm.includes(term)) {
        score += 20;
        termHit = true;
      }
      if (castNorm.includes(term)) {
        score += 14;
        termHit = true;
      }
      if (realNorm.includes(term)) {
        score += 12;
        termHit = true;
      }
      if (keywordsNorm.includes(term)) {
        score += 10;
        termHit = true;
      }
      if (genreNorm.includes(term)) {
        score += 8;
        termHit = true;
      }
      if (synopsisNorm.includes(term)) {
        score += 4;
        termHit = true;
      }

      if (termHit) {
        termsMatched++;
      }
    }

    if (matched || termsMatched > 0) {
      if (termsMatched === queryTerms.length && queryTerms.length > 1) {
        score += 25;
      }
      results.push({ film, score });
    }
  }

  // Tri par pertinence décroissante, puis par vues
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (Number(b.film.view) || 0) - (Number(a.film.view) || 0);
  });

  return results.map(r => r.film);
}



