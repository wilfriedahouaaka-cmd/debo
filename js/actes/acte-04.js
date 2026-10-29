/**
 * Acte 4 — Le Crescendo
 *
 * Six photos et une vidéo, dans l'ordre préparé avec Wilfried.
 * Le récit tient en trois gestes :
 *
 * 1. le lien : une constellation de points apparaît puis explose ;
 * 2. la première photo : floue, elle devient nette au scroll, comme à
 *    l'acte 2, mais le geste est désormais connu ;
 * 3. les souvenirs : les autres photos et la vidéo sont dispersés dans
 *    beaucoup de vide, séparés par au moins un demi-écran.
 *
 * La vidéo ne démarre jamais seule : un clic est obligatoire. Sa première
 * image reste masquée, et la musique s'efface pendant la lecture.
 *
 * Tous les textes sont dans acte-04-textes.js : Wilfried peut les corriger
 * sans toucher à la mécanique.
 */

import { mediasDeActe } from '../core/assets.js';
import { CONFIG } from '../core/config.js';
import { jouer, fonduVers, pause } from '../core/audio-manager.js';
import { mouvementReduit, annoncer } from '../core/utils.js';
import { TEXTES, ORDRE } from './acte-04-textes.js';

export const titre = 'Le Crescendo';

/* --------------------------------------------------------------------------
   Réglages
   -------------------------------------------------------------------------- */

/** Nombre maximum de particules de l'explosion (perf sur téléphone). */
const MAX_PARTICULES = 110;

/** Durées de la constellation, en millisecondes. */
const DUREE_CONSTELLATION = 2900;
const DUREE_EXPLOSION = 1500;
const DUREE_TOTALE = DUREE_CONSTELLATION + DUREE_EXPLOSION;

/** Couleurs du ciel de l'acte, alignées sur les jetons de variables.css. */
const COULEURS = ['#c9a86a', '#d08c9d', '#8e6fa8'];

/**
 * Les dix-huit points de la constellation, en coordonnées relatives.
 * Aucune position n'est tirée au hasard : la scène est identique à chaque
 * lecture, comme les trajectoires de l'acte 5.
 */
const POINTS = Object.freeze([
  [0.18, 0.30], [0.29, 0.20], [0.42, 0.27], [0.55, 0.18], [0.68, 0.25], [0.80, 0.36],
  [0.33, 0.43], [0.46, 0.48], [0.59, 0.41], [0.72, 0.52], [0.24, 0.57], [0.39, 0.64],
  [0.54, 0.60], [0.68, 0.69], [0.30, 0.76], [0.48, 0.82], [0.64, 0.78], [0.78, 0.66],
]);

/** Les liens entre les points : une constellation lisible, pas un filet. */
const LIENS = Object.freeze([
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [0, 6], [2, 6], [2, 7], [3, 7], [4, 8], [5, 9],
  [6, 7], [7, 8], [8, 9],
  [6, 10], [7, 11], [8, 12], [9, 13],
  [10, 11], [11, 12], [12, 13],
  [10, 14], [11, 14], [11, 15], [12, 15], [12, 16], [13, 16], [13, 17],
  [14, 15], [15, 16], [16, 17],
]);

/* --------------------------------------------------------------------------
   État du module
   -------------------------------------------------------------------------- */

let racine = null;
let zone = null;
let intro = null;
let toile = null;
let contexte = null;
let bouton = null;

let souvenirs = [];
let medias = [];
let premier = null;
let premierCadre = null;
let premierNette = null;
let premierLigne = null;
let indicePremier = null;

let video = null;
let cadreVideo = null;
let boutonVideo = null;
let erreurVideo = null;

/** Invalide les fondus de musique lancés par un ancien état de la vidéo. */
let jetonVideo = 0;

let observers = [];
let demande = null;
let session = 0;
let reduit = false;
let vue = new Set();

let animationToile = null;
let toileSession = 0;
let observateurToile = null;
let particules = [];
let tailleToile = { largeur: 1, hauteur: 1, dpr: 1 };
let debutToile = 0;

/* --------------------------------------------------------------------------
   Construction
   -------------------------------------------------------------------------- */

/** Échappe le texte saisi dans le fichier de données avant de l'injecter. */
function echapper(valeur) {
  const correspondances = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return String(valeur ?? '').replace(/[&<>"']/g, (caractere) => correspondances[caractere]);
}

/** Les deux textes d'un média, avec un repli si une clé manque. */
function textesDe(media) {
  return {
    description: media.texte?.description ?? '',
    personnel: media.texte?.personnel ?? '',
  };
}

/** Une photo ordinaire, chargée seulement à l'entrée de l'acte. */
function photoOrdinaire(media, estDerniere) {
  const texte = textesDe(media);
  const derniere = estDerniere ? ' crescendo__souvenir--dernier' : '';

  return `
    <li class="crescendo__souvenir${derniere}" data-media="${echapper(media.data.id)}">
      <figure class="crescendo__souvenir-figure">
        <div class="crescendo__cadre">
          <img
            class="crescendo__photo"
            data-src="${media.data.fichier}"
            alt=""
            width="${media.data.largeur ?? ''}"
            height="${media.data.hauteur ?? ''}"
            loading="lazy"
            decoding="async"
          >
        </div>

        <figcaption class="crescendo__legende">
          <p class="crescendo__description">${echapper(texte.description)}</p>
          <p class="crescendo__message">${echapper(texte.personnel)}</p>
        </figcaption>
      </figure>
    </li>
  `;
}

/**
 * La première photo : deux copies superposées.
 * La version floue reste dessous ; la version nette se découvre depuis la
 * droite au fil du scroll, exactement comme à l'acte 2.
 */
function premierePhoto(media) {
  const texte = textesDe(media);
  const image = `
    data-src="${media.data.fichier}"
    width="${media.data.largeur ?? ''}"
    height="${media.data.hauteur ?? ''}"
    decoding="async"
  `;

  return `
    <li class="crescendo__souvenir crescendo__souvenir--premier" data-media="${echapper(media.data.id)}">
      <figure class="crescendo__premier">
        <div class="crescendo__premier-scene">
          <div class="crescendo__premier-cadre">
            <img class="crescendo__photo crescendo__photo--floue" ${image} alt="" aria-hidden="true" loading="eager">
            <img class="crescendo__photo crescendo__photo--nette" ${image} alt="" loading="eager">

            <span class="crescendo__ligne" aria-hidden="true"></span>
            <span class="crescendo__premier-voile" aria-hidden="true"></span>
          </div>

          <figcaption class="crescendo__premier-texte">
            <p class="crescendo__description">${echapper(texte.description)}</p>
            <p class="crescendo__message">${echapper(texte.personnel)}</p>
          </figcaption>

          <p class="crescendo__indice" aria-hidden="true">Défiler</p>
        </div>
      </figure>
    </li>
  `;
}

/** La vidéo : une image d'attente propre, un bouton de lecture, aucun autoplay. */
function souvenirVideo(media) {
  const texte = textesDe(media);
  const titreVideo = media.texte?.titre ?? 'La vidéo';

  return `
    <li class="crescendo__souvenir crescendo__souvenir--video" data-media="${echapper(media.data.id)}">
      <figure class="crescendo__video">
        <h2 class="crescendo__video-titre">${echapper(titreVideo)}</h2>

        <div class="crescendo__video-cadre">
          <button
            class="crescendo__video-play"
            type="button"
            aria-label="Lire la vidéo « ${echapper(titreVideo)} »"
            aria-describedby="crescendo-video-description"
          >
            <span class="crescendo__video-icone" aria-hidden="true"></span>
            <span class="crescendo__video-libelle">Lire la vidéo</span>
          </button>

          <video
            class="crescendo__video-media"
            width="${media.data.largeur ?? 360}"
            height="${media.data.hauteur ?? 642}"
            controls
            playsinline
            preload="metadata"
            tabindex="-1"
            aria-label="Vidéo : ${echapper(titreVideo)}"
            aria-describedby="crescendo-video-description"
          >
            <source data-src="${media.data.fichier}" type="${media.data.type ?? 'video/mp4'}">
            Votre navigateur ne peut pas lire cette vidéo.
          </video>

          <p class="crescendo__video-erreur" hidden>
            La vidéo n’a pas pu se charger. Le souvenir reste lisible juste en dessous.
          </p>
        </div>

        <figcaption class="crescendo__legende">
          <p class="crescendo__description" id="crescendo-video-description">${echapper(texte.description)}</p>
          <p class="crescendo__message">${echapper(texte.personnel)}</p>
        </figcaption>
      </figure>
    </li>
  `;
}

const STRUCTURE = (souvenirsHtml) => `
  <div
    class="crescendo"
    tabindex="0"
    role="region"
    aria-label="Le Crescendo — fais défiler pour découvrir les souvenirs"
  >
    <span class="crescendo__fil" aria-hidden="true">
      <span class="crescendo__fil-rempli"></span>
    </span>

    <div class="crescendo__piste">
      <header class="crescendo__intro">
        <div class="crescendo__intro-texte">
          <p class="crescendo__surtitre">Acte 04 / 07</p>
          <h1 class="crescendo__titre">Le Crescendo</h1>
        </div>

        <canvas class="crescendo__toile" aria-hidden="true"></canvas>
        <p class="crescendo__indice" aria-hidden="true">Défiler</p>
      </header>

      <ol class="crescendo__souvenirs" role="list">
        ${souvenirsHtml}
      </ol>

      <footer class="crescendo__pied">
        <button class="crescendo__suite" type="button" hidden>Continuer</button>
      </footer>
    </div>
  </div>
`;

export function init(conteneur) {
  const { photos, video: mediaVideo } = mediasDeActe(4);

  if (!photos.length || !mediaVideo) {
    throw new Error('Acte 4 : photos ou vidéo manquantes dans assets.js');
  }

  const photosParId = new Map(photos.map((photo) => [photo.id, photo]));

  medias = ORDRE.map((id) => {
    if (id === mediaVideo.id) {
      return { type: 'video', data: mediaVideo, texte: TEXTES[id] ?? {} };
    }

    const photo = photosParId.get(id);
    return photo ? { type: 'photo', data: photo, texte: TEXTES[id] ?? {} } : null;
  }).filter(Boolean);

  if (medias.length !== photos.length + 1) {
    throw new Error('Acte 4 : l’ordre des médias ne correspond pas aux assets');
  }

  if (medias[0]?.type !== 'photo') {
    throw new Error('Acte 4 : la première photo doit ouvrir l’acte');
  }

  const html = medias
    .map((media, index) => {
      if (media.type === 'video') return souvenirVideo(media);
      if (index === 0) return premierePhoto(media);
      return photoOrdinaire(media, index === medias.length - 1);
    })
    .join('');

  conteneur.classList.add('acte--crescendo');
  conteneur.innerHTML = STRUCTURE(html);

  racine = conteneur;
  zone = conteneur.querySelector('.crescendo');
  intro = conteneur.querySelector('.crescendo__intro');
  toile = conteneur.querySelector('.crescendo__toile');
  bouton = conteneur.querySelector('.crescendo__suite');

  souvenirs = [...conteneur.querySelectorAll('.crescendo__souvenir')];
  premier = conteneur.querySelector('.crescendo__souvenir--premier');
  premierCadre = conteneur.querySelector('.crescendo__premier-cadre');
  premierNette = conteneur.querySelector('.crescendo__photo--nette');
  premierLigne = conteneur.querySelector('.crescendo__ligne');
  indicePremier = conteneur.querySelector('.crescendo__premier .crescendo__indice');

  video = conteneur.querySelector('.crescendo__video-media');
  cadreVideo = conteneur.querySelector('.crescendo__video-cadre');
  boutonVideo = conteneur.querySelector('.crescendo__video-play');
  erreurVideo = conteneur.querySelector('.crescendo__video-erreur');

  if (zone) zone.addEventListener('scroll', surDefilement, { passive: true });

  if (bouton) {
    bouton.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('acte:suivant'));
    });
  }

  if (boutonVideo) {
    boutonVideo.addEventListener('click', lancerVideo);
  }

  if (video) {
    video.addEventListener('play', surLectureVideo);
    video.addEventListener('pause', surPauseVideo);
    video.addEventListener('ended', surFinVideo);
    video.addEventListener('error', montrerErreurVideo);
    video.addEventListener('loadedmetadata', surMetadataVideo);

    const source = video.querySelector('source');
    if (source) source.addEventListener('error', montrerErreurVideo);
  }

  if (toile) {
    contexte = toile.getContext('2d');
    dimensionnerToile();
  }

  window.addEventListener('resize', surRedimensionnement);
}

/* --------------------------------------------------------------------------
   Cycle de vie
   -------------------------------------------------------------------------- */

export function enter() {
  const jeton = ++session;
  jetonVideo += 1;
  nettoyer();
  reduit = mouvementReduit();

  // Les médias ne sont demandés qu'une fois l'acte réellement visible :
  // c'est la leçon de l'acte 3, où un chargement trop tôt empêchait Chromium
  // de peindre les images.
  racine?.querySelectorAll('img[data-src]').forEach((image) => {
    image.src = image.dataset.src;
    image.removeAttribute('data-src');
  });

  const source = video?.querySelector('source[data-src]');
  if (source) {
    source.src = source.dataset.src;
    source.removeAttribute('data-src');
    video.load();
  }

  // On remet la scène dans son état de départ, y compris si l'acte est
  // rouvert depuis le lien de debug.
  if (zone) {
    zone.scrollTop = 0;
    zone.style.setProperty('--progression', '0');
  }

  vue = new Set();
  if (bouton) {
    bouton.hidden = true;
    bouton.classList.remove('est-visible');
  }

  souvenirs.forEach((souvenir) => souvenir.classList.remove('est-visible'));
  premier?.classList.remove('est-texte', 'est-suite');
  indicePremier?.classList.remove('est-parti');
  intro?.classList.remove('est-visible');

  if (video) {
    video.pause();
    video.currentTime = 0;
    // Tant que la première image est masquée, la vidéo ne doit pas être un
    // arrêt de tabulation invisible : le bouton de lecture suffit.
    video.setAttribute('tabindex', '-1');
  }

  if (cadreVideo) cadreVideo.classList.remove('est-jouee', 'est-erreur');
  if (boutonVideo) boutonVideo.hidden = false;
  if (erreurVideo) erreurVideo.hidden = true;

  if (intro) {
    // Force le recalcul avant de relancer le fondu du titre.
    void intro.offsetWidth;
    intro.classList.add('est-visible');
  }

  appliquerPremier(reduit ? 1 : 0);

  // La musique de l'acte 4 est au premier plan : c'est le crescendo.
  jouer();
  fonduVers(CONFIG.audio.volume, 1200);

  // La photo et les textes se révèlent à mesure qu'ils entrent dans le champ.
  if (zone) {
    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          if (!entree.isIntersecting) return;

          const souvenir = entree.target;
          souvenir.classList.add('est-visible');

          if (souvenir.dataset.media) vue.add(souvenir.dataset.media);
          if (vue.size >= medias.length) revelerSuite();
        });
      },
      { root: zone, threshold: 0.18, rootMargin: '0px 0px -12% 0px' }
    );

    souvenirs.forEach((souvenir) => observateur.observe(souvenir));
    observers.push(observateur);
  }

  if (intro && !reduit) {
    observateurToile = new IntersectionObserver(
      (entrees) => {
        const visible = entrees[0]?.isIntersecting;
        if (visible) demarrerToile(session);
        else arreterToile();
      },
      { threshold: 0.01 }
    );

    observateurToile.observe(intro);
    observers.push(observateurToile);
  }

  document.addEventListener('visibilitychange', surVisibilite);

  if (reduit) {
    dessinerStatique();
    appliquerPremier(1);
  } else {
    demarrerToile(jeton);
  }
}

export function exit() {
  session += 1;
  jetonVideo += 1;
  nettoyer();

  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

function nettoyer() {
  if (demande) cancelAnimationFrame(demande);
  demande = null;

  observers.forEach((observateur) => observateur.disconnect());
  observers = [];

  arreterToile();
  document.removeEventListener('visibilitychange', surVisibilite);
}

/* --------------------------------------------------------------------------
   Le fil doré et la première photo
   -------------------------------------------------------------------------- */

function surDefilement() {
  if (demande) return;

  demande = requestAnimationFrame(() => {
    demande = null;
    mettreAJourFil();
    if (!reduit) mettreAJourPremier();
  });
}

function mettreAJourFil() {
  if (!zone) return;

  const hauteurUtile = zone.scrollHeight - zone.clientHeight;
  const progression = hauteurUtile > 0 ? zone.scrollTop / hauteurUtile : 1;
  zone.style.setProperty('--progression', Math.min(Math.max(progression, 0), 1).toFixed(4));
}

function mettreAJourPremier() {
  if (!premier || !zone) return;

  const hauteurUtile = premier.offsetHeight - zone.clientHeight;
  const progression = hauteurUtile > 0 ? (zone.scrollTop - premier.offsetTop) / hauteurUtile : 1;

  appliquerPremier(progression);
}

/**
 * Une seule valeur pilote la découpe de la photo nette, le filet et les
 * deux textes de la première image.
 */
function appliquerPremier(valeur) {
  const progression = Math.min(Math.max(valeur, 0), 1);

  if (premierNette) {
    premierNette.style.clipPath = `inset(0 0 0 ${(1 - progression) * 100}%)`;
  }

  if (premierLigne && premierCadre) {
    const largeur = premierCadre.clientWidth || 1;
    premierLigne.style.transform = `translate3d(-${progression * largeur}px, 0, 0)`;
  }

  if (indicePremier) {
    indicePremier.classList.toggle('est-parti', reduit || progression > 0.02);
  }

  if (premier) {
    premier.classList.toggle('est-texte', reduit || progression >= 0.54);
    premier.classList.toggle('est-suite', reduit || progression >= 0.68);
  }
}

/* --------------------------------------------------------------------------
   La suite
   -------------------------------------------------------------------------- */

function revelerSuite() {
  if (!bouton || !bouton.hidden) return;

  bouton.hidden = false;
  requestAnimationFrame(() => bouton.classList.add('est-visible'));
  annoncer('Tous les souvenirs sont là. Tu peux continuer.');
}

/* --------------------------------------------------------------------------
   La vidéo
   -------------------------------------------------------------------------- */

function lancerVideo() {
  if (!video) return;

  // Le clic est un vrai geste utilisateur : on s'assure que la vidéo n'est
  // pas restée muette après une lecture précédente ou une politique navigateur.
  video.muted = false;
  if (video.volume === 0) video.volume = 1;

  const lecture = video.play();
  if (lecture && typeof lecture.catch === 'function') {
    lecture.catch(() => montrerErreurVideo());
  }
}

function surLectureVideo() {
  if (cadreVideo) {
    cadreVideo.classList.add('est-jouee');
    cadreVideo.classList.remove('est-erreur');
  }

  // La vidéo est désormais visible : ses contrôles natifs redeviennent
  // accessibles au clavier.
  if (video) video.removeAttribute('tabindex');
  if (boutonVideo) boutonVideo.hidden = true;

  // La vidéo a sa propre voix : on ne laisse pas la musique par-dessus.
  // Le fondu court évite une coupure brutale ; la musique est ensuite mise
  // en pause, puis reprise à la pause ou à la fin de la vidéo.
  const jeton = ++jetonVideo;
  fonduVers(0, 450).then(() => {
    if (jeton !== jetonVideo) return;
    if (video && !video.paused && !video.ended) pause();
  });
}

function surPauseVideo() {
  if (!video || video.ended) return;

  jetonVideo += 1;
  jouer();
  fonduVers(CONFIG.audio.volume, 800);
}

function surFinVideo() {
  jetonVideo += 1;
  jouer();
  fonduVers(CONFIG.audio.volume, 800);
}

function surMetadataVideo() {
  if (cadreVideo) cadreVideo.classList.remove('est-erreur');
  if (erreurVideo) erreurVideo.hidden = true;
  if (boutonVideo && video?.paused) boutonVideo.hidden = false;
}

function montrerErreurVideo() {
  if (cadreVideo) {
    cadreVideo.classList.add('est-erreur');
    cadreVideo.classList.remove('est-jouee');
  }

  if (boutonVideo) boutonVideo.hidden = true;
  if (erreurVideo) erreurVideo.hidden = false;

  // Si l'erreur survient après le démarrage, la musique avait été mise en
  // pause : on la relance pour ne pas laisser un silence inattendu.
  jetonVideo += 1;
  jouer();
  fonduVers(CONFIG.audio.volume, 900);
}

/* --------------------------------------------------------------------------
   La constellation
   -------------------------------------------------------------------------- */

function dimensionnerToile() {
  if (!toile || !contexte) return;

  const largeur = Math.max(1, toile.clientWidth);
  const hauteur = Math.max(1, toile.clientHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  toile.width = Math.round(largeur * dpr);
  toile.height = Math.round(hauteur * dpr);
  contexte.setTransform(dpr, 0, 0, dpr, 0, 0);

  tailleToile = { largeur, hauteur, dpr };

  if (reduit) dessinerStatique();
}

function surRedimensionnement() {
  if (!toile) return;

  dimensionnerToile();

  // Une toile redimensionnée repart de zéro au prochain passage.
  if (!reduit && intro?.classList.contains('est-visible')) {
    demarrerToile(session);
  }
}

function demarrerToile(jeton) {
  if (!toile || !contexte || reduit) {
    dessinerStatique();
    return;
  }

  arreterToile();
  toileSession = jeton;
  debutToile = performance.now();
  animationToile = requestAnimationFrame(() => boucleToile(jeton));
}

function arreterToile() {
  if (animationToile) cancelAnimationFrame(animationToile);
  animationToile = null;
  toileSession += 1;
}

function boucleToile(jeton) {
  if (jeton !== toileSession || !contexte) return;

  const temps = performance.now() - debutToile;
  dessinerToile(temps);

  if (temps < DUREE_TOTALE) {
    animationToile = requestAnimationFrame(() => boucleToile(jeton));
  } else {
    animationToile = null;
  }
}

function dessinerToile(temps) {
  if (!contexte) return;

  const { largeur, hauteur } = tailleToile;
  contexte.clearRect(0, 0, largeur, hauteur);

  if (temps < DUREE_CONSTELLATION) {
    const points = Math.min(Math.max(temps / 1100, 0), 1);
    const liens = Math.min(Math.max((temps - 800) / 1500, 0), 1);
    dessinerConstellation(points, liens);
    return;
  }

  const progression = Math.min(Math.max((temps - DUREE_CONSTELLATION) / DUREE_EXPLOSION, 0), 1);
  dessinerExplosion(progression);
}

function dessinerConstellation(apparitionPoints, apparitionLiens) {
  const { largeur, hauteur } = tailleToile;

  contexte.save();
  contexte.lineWidth = 0.7;

  LIENS.forEach(([depart, fin], index) => {
    const alphaLien = Math.max(0, Math.min(apparitionLiens - index * 0.012, 1));
    if (alphaLien <= 0) return;

    const a = POINTS[depart];
    const b = POINTS[fin];

    contexte.globalAlpha = alphaLien * 0.24;
    contexte.strokeStyle = COULEURS[0];
    contexte.beginPath();
    contexte.moveTo(a[0] * largeur, a[1] * hauteur);
    contexte.lineTo(b[0] * largeur, b[1] * hauteur);
    contexte.stroke();
  });

  POINTS.forEach((point, index) => {
    const alphaPoint = Math.max(0, Math.min(apparitionPoints - index * 0.025, 1));
    if (alphaPoint <= 0) return;

    const x = point[0] * largeur;
    const y = point[1] * hauteur;
    const rayon = index % 5 === 0 ? 2.6 : 1.6;
    const couleur = COULEURS[index % COULEURS.length];

    contexte.globalAlpha = alphaPoint * (index % 5 === 0 ? 0.9 : 0.55);
    contexte.fillStyle = couleur;
    contexte.shadowColor = couleur;
    contexte.shadowBlur = index % 5 === 0 ? 14 : 7;
    contexte.beginPath();
    contexte.arc(x, y, rayon, 0, Math.PI * 2);
    contexte.fill();
  });

  contexte.restore();
}

function dessinerExplosion(progression) {
  const { largeur, hauteur } = tailleToile;
  const centreX = largeur * 0.5;
  const centreY = hauteur * 0.45;
  const alpha = Math.max(0, 1 - progression);
  const rayonMax = Math.max(largeur, hauteur) * 0.68;

  if (!particules.length) creerParticules();

  // La constellation se défait en même temps que les particules partent.
  contexte.save();
  contexte.globalAlpha = Math.max(0, 1 - progression * 1.5);

  LIENS.forEach(([depart, fin]) => {
    const a = POINTS[depart];
    const b = POINTS[fin];
    contexte.strokeStyle = COULEURS[0];
    contexte.lineWidth = 0.6;
    contexte.beginPath();
    contexte.moveTo(a[0] * largeur, a[1] * hauteur);
    contexte.lineTo(b[0] * largeur, b[1] * hauteur);
    contexte.stroke();
  });

  contexte.restore();

  // Halo central, très discret : il donne une source à l'explosion.
  const halo = contexte.createRadialGradient(centreX, centreY, 0, centreX, centreY, rayonMax * 0.38);
  halo.addColorStop(0, `rgba(216, 184, 120, ${0.18 * alpha})`);
  halo.addColorStop(1, 'rgba(216, 184, 120, 0)');
  contexte.globalAlpha = 1;
  contexte.fillStyle = halo;
  contexte.fillRect(0, 0, largeur, hauteur);

  particules.forEach((particule) => {
    const progressionParticule = Math.min(
      Math.max((progression - particule.retard) / (1 - particule.retard), 0),
      1
    );
    const distance = rayonMax * particule.vitesse * progressionParticule;
    const x = centreX + Math.cos(particule.angle) * distance;
    const y = centreY + Math.sin(particule.angle) * distance;
    const opacite = alpha * (1 - progressionParticule * 0.35);

    contexte.globalAlpha = Math.max(0, opacite);
    contexte.fillStyle = particule.couleur;
    contexte.beginPath();
    contexte.arc(x, y, particule.taille, 0, Math.PI * 2);
    contexte.fill();
  });

  contexte.globalAlpha = 1;
}

function creerParticules() {
  particules = [];

  for (let index = 0; index < MAX_PARTICULES; index += 1) {
    const angle = (index / MAX_PARTICULES) * Math.PI * 2 + Math.sin(index * 1.7) * 0.22;
    const vitesse = 0.35 + (((index * 37) % 100) / 100) * 0.9;
    const taille = 0.8 + (((index * 13) % 100) / 100) * 1.8;
    const retard = (((index * 29) % 100) / 100) * 0.25;

    particules.push({
      angle,
      vitesse,
      taille,
      retard,
      couleur: COULEURS[index % COULEURS.length],
    });
  }
}

/** Version sans animation, pour « mouvement réduit ». */
function dessinerStatique() {
  if (!contexte) return;

  const { largeur, hauteur } = tailleToile;
  contexte.clearRect(0, 0, largeur, hauteur);
  dessinerConstellation(1, 1);
}

/* --------------------------------------------------------------------------
   Divers
   -------------------------------------------------------------------------- */

function surVisibilite() {
  if (!toile || reduit) return;

  if (document.hidden) {
    arreterToile();
  } else if (intro?.classList.contains('est-visible')) {
    demarrerToile(session);
  }
}
