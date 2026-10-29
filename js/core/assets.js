/**
 * Source unique de vérité pour les médias.
 *
 * Règle : aucun chemin de fichier n'est écrit ailleurs dans le projet.
 * Si un média est renommé, on ne modifie que ce fichier.
 * Les chemins sont relatifs à index.html, pas au module.
 */

const RACINE = 'assets';

/** Construit un chemin de média sans jamais laisser traîner de double slash. */
function chemin(dossier, fichier) {
  return `${RACINE}/${dossier}/${fichier}`;
}

/* --------------------------------------------------------------------------
   Décors — fonds d'ambiance du site
   La nébuleuse est le fond global du ciel. Le PNG original (1,5 Mo) reste
   dans le dossier comme source de travail ; le site charge uniquement le
   JPEG optimisé (environ 130 Ko) pour ne pas ralentir le téléphone.
   -------------------------------------------------------------------------- */
export const DECORS = Object.freeze({
  nebuleuse: Object.freeze({
    id: 'nebuleuse',
    fichier: chemin('decors', 'nebuleuse.jpg'),
    alt: '', // purement décoratif : le ciel est déjà masqué aux lecteurs d'écran
  }),
});

/* --------------------------------------------------------------------------
   Musique
   -------------------------------------------------------------------------- */
export const AUDIO = Object.freeze({
  principal: Object.freeze({
    id: 'principal',
    fichier: chemin('musiques', 'Drake - Hotline Bling(MP3_160K).mp3'),
    titre: 'Hotline Bling',
    interprete: 'Drake',
    boucle: true,
  }),
});

/* --------------------------------------------------------------------------
   Photos
   Les textes alternatifs sont volontairement vides pour l'instant.
   Un alt vide = image décorative. Dès que la photo porte du sens dans le récit,
   il faudra le décrire en une phrase courte et concrète.
   -------------------------------------------------------------------------- */
export const PHOTOS = Object.freeze({
  a: Object.freeze({ id: 'a', fichier: chemin('photos', 'a.jpeg'), largeur: 540, hauteur: 960, alt: '' }),
  b: Object.freeze({ id: 'b', fichier: chemin('photos', 'b.jpeg'), largeur: 540, hauteur: 960, alt: '' }),
  c: Object.freeze({ id: 'c', fichier: chemin('photos', 'c.jpeg'), largeur: 720, hauteur: 1280, alt: '' }),
  e: Object.freeze({ id: 'e', fichier: chemin('photos', 'e.jpeg'), largeur: 720, hauteur: 1280, alt: '' }),
  v: Object.freeze({ id: 'v', fichier: chemin('photos', 'v.jpeg'), largeur: 540, hauteur: 960, alt: '' }),
  w: Object.freeze({ id: 'w', fichier: chemin('photos', 'w.jpeg'), largeur: 720, hauteur: 1280, alt: '' }),
  x: Object.freeze({ id: 'x', fichier: chemin('photos', 'x.jpeg'), largeur: 720, hauteur: 1280, alt: '' }),
});

/* --------------------------------------------------------------------------
   Vidéo
   -------------------------------------------------------------------------- */
export const VIDEOS = Object.freeze({
  cs: Object.freeze({
    id: 'cs',
    fichier: chemin('videos', 'cs.mp4'),
    type: 'video/mp4',
    alt: '', // à décrire quand on connaîtra le contenu exact
  }),
});

/* --------------------------------------------------------------------------
   Univers de Déborah — acte 3
   Les 15 visuels sont réunis dans assets/univers/.

   L'ordre de déclaration est l'ordre du scénario : il alterne volontairement
   musique, animé et série. Ne pas trier par catégorie, ce serait un catalogue.
   Les dimensions réelles sont conservées pour éviter les sauts de mise en page.
   -------------------------------------------------------------------------- */

/** Fabrique une référence d'univers : une seule forme pour les 15 fragments. */
function referenceUnivers(id, titre, famille, largeur, hauteur) {
  return Object.freeze({
    id,
    titre,
    famille, // 'musique' | 'anime' | 'serie' — porte la couleur du fragment
    fichier: chemin('univers', `${id}.jpg`),
    largeur,
    hauteur,
    alt: '', // décoratif : le titre est affiché à côté
  });
}

export const UNIVERS = Object.freeze({
  // 1
  drake: referenceUnivers('drake', 'Drake', 'musique', 736, 1308),
  // 2
  'hunter-x-hunter': referenceUnivers('hunter-x-hunter', 'Hunter × Hunter', 'anime', 678, 1200),
  // 3
  bridgerton: referenceUnivers('bridgerton', 'Bridgerton', 'serie', 736, 1308),
  // 4
  'katy-perry': referenceUnivers('katy-perry', 'Katy Perry', 'musique', 736, 1308),
  // 5
  naruto: referenceUnivers('naruto', 'Naruto', 'anime', 736, 1313),
  // 6
  'love-101': referenceUnivers('love-101', 'Love 101', 'serie', 736, 1104),
  // 7
  'martina-stoessel': referenceUnivers('martina-stoessel', 'Martina Stoessel', 'musique', 675, 1200),
  // 8
  kuroko: referenceUnivers('kuroko', "Kuroko's Basket", 'anime', 720, 1280),
  // 9
  mehek: referenceUnivers('mehek', 'Mehek', 'serie', 720, 1280),
  // 10
  fr2d: referenceUnivers('fr2d', 'FR2D', 'musique', 1080, 969),
  // 11
  'south-park': referenceUnivers('south-park', 'South Park', 'anime', 720, 1280),
  // 12
  'to-all-the-boys': referenceUnivers('to-all-the-boys', "À tous les garçons que j'ai aimés", 'serie', 736, 1308),
  // 13
  'david-okit': referenceUnivers('david-okit', 'David Okit', 'musique', 736, 1104),
  // 14
  'walter-boys': referenceUnivers('walter-boys', 'Ma vie avec les Walter Boys', 'serie', 736, 980),
  // 15
  'changements-du-destin': referenceUnivers('changements-du-destin', 'Les changements du destin', 'serie', 1080, 881),
});

/* --------------------------------------------------------------------------
   Répartition des médias par acte — conforme à docs/scenario.md
   1. Le Signal         : aucun média
   2. La Première Image : la photo 'a', portrait d'ouverture
   3. Les Univers       : les 15 visuels d'univers, dans l'ordre de déclaration
   4. Le Crescendo      : les six autres photos + la vidéo
   5 à 7                : aucun média

   La photo 'a' est le seul portrait qui n'apparaît pas dans l'acte 4 :
   elle ouvre le récit, puis les six autres prennent le relais.
   -------------------------------------------------------------------------- */
export const PAR_ACTE = Object.freeze({
  1: Object.freeze({ photos: [], video: null }), // Le Signal
  2: Object.freeze({ photos: ['a'], video: null }), // portrait d'ouverture
  3: Object.freeze({ photos: [], video: null, univers: Object.freeze(Object.values(UNIVERS)) }),
  4: Object.freeze({ photos: ['b', 'c', 'e', 'v', 'w', 'x'], video: 'cs' }),
  5: Object.freeze({ photos: [], video: null }), // Le Lien
  6: Object.freeze({ photos: [], video: null }), // Le Silence
  7: Object.freeze({ photos: [], video: null }), // La Fin
});

/** Récupère un média par acte sans laisser les modules se balader dans la structure. */
export function mediasDeActe(numero) {
  const repartition = PAR_ACTE[numero];
  if (!repartition) return { photos: [], video: null, univers: [] };

  return {
    photos: repartition.photos.map((id) => PHOTOS[id]).filter(Boolean),
    video: repartition.video ? VIDEOS[repartition.video] ?? null : null,
    univers: repartition.univers ?? [],
  };
}
