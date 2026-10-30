/**
 * Acte 3 — Les Univers
 *
 * Quinze fragments de ce qu'elle aime, dans l'ordre du scénario :
 * musique, animé, série, sans tri par catégorie — un tri ferait catalogue.
 *
 * Une carte à la fois. Elle arrive de loin, petite et floue, se pose avec
 * une ombre et une légère inclinaison, reste le temps de lire, puis s'écarte
 * pour laisser place à la suivante. Un clic, un tap ou Entrée/Espace passe
 * immédiatement au fragment suivant.
 */

import { mediasDeActe } from '../core/assets.js';
import { CONFIG } from '../core/config.js';
import { jouer, fonduVers } from '../core/audio-manager.js';
import { mouvementReduit, attendre, annoncer } from '../core/utils.js';

export const titre = 'Les Univers';

/* Durées en millisecondes — à garder alignées avec css/actes/acte-03.css. */
const DUREE_ENTREE = 1200;
const PAUSE_LECTURE = 4200;
const DUREE_SORTIE = 1000;
const ENTRE_CARTES = 350;
const DUREE_COUPE = 220;

/**
 * Catégorie affichée sur la carte + message personnel.
 * Les huit premières phrases viennent de la référence Stitch.
 * Les sept autres restent des propositions à valider avec Wilfried.
 */
const DETAILS = Object.freeze({
  drake: {
    categorie: 'Rap & R&B',
    phrase: 'Pour les nuits où tu as besoin de te sentir invincible.',
  },
  'hunter-x-hunter': {
    categorie: 'Animé Aventure',
    phrase: 'Comme Gon, tu continues même quand ça fait mal.',
  },
  bridgerton: {
    categorie: 'Série Romance',
    phrase: "L'élégance, le désir et les non-dits.",
  },
  'katy-perry': {
    categorie: 'Pop Solaire',
    phrase: "Pour briller sans jamais s'excuser d'exister.",
  },
  naruto: {
    categorie: 'Animé Ninjas',
    phrase: 'Transformer la solitude en force inébranlable.',
  },
  'love-101': {
    categorie: 'Série Jeunesse',
    phrase: "L'apprentissage du cœur, sans filtre et sincère.",
  },
  'martina-stoessel': {
    categorie: 'Chanteuse & Actrice',
    phrase: 'Une énergie rayonnante et passionnée.',
  },
  kuroko: {
    categorie: 'Animé Basket',
    phrase: 'Ta présence change tout, même en toute discrétion.',
  },
  mehek: {
    categorie: 'Série Drame',
    phrase: 'Les amours qui prennent leur temps, sans jamais s’excuser.',
  },
  fr2d: {
    categorie: 'Rap',
    phrase: 'Le son brut qui remet debout les jours difficiles.',
  },
  'south-park': {
    categorie: 'Animation Satire',
    phrase: 'Rire de tout, surtout de ce qui ne se dit pas.',
  },
  'to-all-the-boys': {
    categorie: 'Série Ado',
    phrase: 'Les premiers battements de cœur, ceux qui restent.',
  },
  'david-okit': {
    categorie: 'Musique',
    phrase: 'Une voix qui apaise quand tout va trop vite.',
  },
  'walter-boys': {
    categorie: 'Série Ado',
    phrase: 'Entre deux mondes, le cœur ne choisit pas.',
  },
  'changements-du-destin': {
    categorie: 'Série Drame',
    phrase: 'Ces détours que la vie impose, et qui finissent par avoir du sens.',
  },
});

/**
 * Génère le HTML d'une carte.
 * Le numéro et la catégorie sont décoratifs : le titre et la phrase suffisent
 * au lecteur d'écran, qui reçoit en plus une annonce à chaque fragment.
 */
function carteHTML(univers, index, total) {
  const detail = DETAILS[univers.id] ?? {};
  const categorie = detail.categorie ?? univers.famille;
  const phrase = detail.phrase ?? '';
  const numero = String(index + 1).padStart(2, '0');
  const totalAffiche = String(total).padStart(2, '0');
  const orientation = univers.largeur > univers.hauteur ? 'paysage' : 'portrait';

  return `
    <li
      class="univers__carte"
      data-index="${index}"
      data-famille="${univers.famille}"
      data-orientation="${orientation}"
      style="--ratio: ${univers.largeur} / ${univers.hauteur};"
      aria-hidden="true"
    >
      <figure class="univers__visuel">
        <img
          data-src="${univers.fichier}"
          alt=""
          width="${univers.largeur}"
          height="${univers.hauteur}"
          loading="lazy"
          decoding="async"
        >
      </figure>

      <div class="univers__contenu">
        <p class="univers__etiquette">
          <span class="univers__point" aria-hidden="true"></span>${categorie}
        </p>
        <h2 class="univers__nom">${univers.titre}</h2>
        ${phrase ? `<p class="univers__phrase">${phrase}</p>` : ''}
        <p class="univers__numero" aria-hidden="true">
          ${numero} <span>/ ${totalAffiche}</span>
        </p>
      </div>
    </li>
  `;
}

const STRUCTURE = (univers) => `
  <div
    class="univers"
    tabindex="0"
    role="region"
    aria-label="Les Univers — ${univers.length} fragments, un par un"
  >
    <div class="univers__entete">
      <div class="univers__intro">
        <p class="univers__surtitre">Quinze fragments</p>
        <h1 class="univers__titre">Les Univers</h1>
      </div>

      <p class="univers__citation">
        « Des fragments de ce que tu aimes, entrelacés dans une seule et même onde. »
      </p>
    </div>

    <!-- Les cartes sont empilées dans la même cellule de grille : une seule
         est visible, mais la hauteur de la scène ne saute pas d'une carte
         à l'autre. -->
    <div class="univers__scene">
      <ul class="univers__pile">
        ${univers.map((u, i) => carteHTML(u, i, univers.length)).join('')}
      </ul>
    </div>

    <div class="univers__pied">
      <p class="univers__note" hidden>
        <span class="univers__etincelle" aria-hidden="true">✦</span>
        Chaque univers te ressemble.
      </p>

      <button class="univers__bouton" type="button" hidden>
        Rejoindre le Crescendo <span aria-hidden="true">→</span>
      </button>
    </div>
  </div>
`;

let racine = null;
let scene = null;
let cartes = [];
let note = null;
let bouton = null;
let enCours = false;
let jeton = 0;
let libererAttente = null;

/** Charge l'image d'une carte, sans attendre. Renvoie l'élément ou null. */
function chargerImage(carte) {
  const img = carte.querySelector('img[data-src]');
  if (!img) return null;

  img.loading = 'eager'; // la carte va être montrée : on ne laisse pas le lazy attendre
  img.src = img.dataset.src;
  img.removeAttribute('data-src');
  return img;
}

/** Attend le décodage de l'image, avec un plafond pour ne jamais bloquer. */
async function preparerImage(carte) {
  chargerImage(carte);

  // L'image a pu être préchargée plus tôt : data-src a déjà disparu, mais
  // il faut tout de même attendre son décodage avant de montrer la carte.
  const img = carte.querySelector('img');
  if (!img || typeof img.decode !== 'function') return;

  try {
    await Promise.race([img.decode(), attendre(2000)]);
  } catch {
    // Image absente ou illisible : la carte reste lisible sans elle.
  }
}

/** Vrai si la séquence en cours est toujours la bonne. */
function valide(mien) {
  return enCours && mien === jeton;
}

/**
 * Attend un délai, mais se laisse réveiller par un tap.
 * Renvoie true si l'attente a été écourtée, false si le délai est allé au bout.
 */
function attendreOuSkip(delai) {
  return new Promise((resolve) => {
    const identifiant = window.setTimeout(() => {
      libererAttente = null;
      resolve(false);
    }, delai);

    libererAttente = () => {
      window.clearTimeout(identifiant);
      libererAttente = null;
      resolve(true);
    };
  });
}

/** Active une carte et prépare la suivante pendant qu'elle se pose. */
function activer(carte, index) {
  cartes.forEach((autre) => {
    const actif = autre === carte;

    autre.classList.toggle('est-active', actif);
    autre.setAttribute('aria-hidden', actif ? 'false' : 'true');
    autre.inert = !actif;

    if (!actif) {
      autre.classList.remove('entre', 'est-sortie', 'sortie', 'est-coupee');
    }
  });

  if (cartes[index + 1]) chargerImage(cartes[index + 1]);

  carte.classList.remove('est-sortie', 'sortie', 'est-coupee');
  void carte.offsetWidth;
  carte.classList.add('entre');

  const nom = carte.querySelector('.univers__nom')?.textContent ?? '';
  annoncer(`Fragment ${index + 1} sur ${cartes.length} : ${nom}`);
}

/** Coupe court à la carte courante quand on veut passer tout de suite. */
async function couper(carte) {
  carte.classList.add('est-coupee');
  await attendre(DUREE_COUPE);
}

/** Fait s'écarter la carte vers la gauche ou la droite. */
async function sortir(carte) {
  carte.classList.add('est-sortie');
  void carte.offsetWidth;
  carte.classList.add('sortie');
  await attendre(DUREE_SORTIE);
}

/**
 * Révèle la note et le bouton de fin.
 * En séquence, on fait doucement défiler l'acte pour que le bouton ne reste
 * pas sous la ligne de flottaison ; en mode statique, on ne bouge pas.
 */
function revelerPied(defiler = false) {
  note.hidden = false;
  bouton.hidden = false;

  void note.offsetWidth;
  note.classList.add('est-visible');

  void bouton.offsetWidth;
  bouton.classList.add('est-visible');
  bouton.disabled = false;

  if (defiler) {
    requestAnimationFrame(() => {
      racine.scrollTo({
        top: racine.scrollHeight,
        behavior: mouvementReduit() ? 'auto' : 'smooth',
      });
    });
  }
}

/** Déroule les quinze cartes, une par une. */
async function jouerSequence(mien) {
  for (let i = 0; i < cartes.length; i++) {
    if (!valide(mien)) return;

    const carte = cartes[i];
    await preparerImage(carte);
    if (!valide(mien)) return;

    activer(carte, i);

    const saute = await attendreOuSkip(DUREE_ENTREE + PAUSE_LECTURE);
    if (!valide(mien)) return;

    // La dernière carte reste en place : on laisse son entrée se terminer
    // avant de révéler la note et le bouton.
    if (i === cartes.length - 1) {
      await attendre(DUREE_ENTREE);
      if (!valide(mien)) return;

      revelerPied(true);
      annoncer('Fin des univers.');
      return;
    }

    if (saute) {
      await couper(carte);
    } else {
      await sortir(carte);
    }
    if (!valide(mien)) return;

    carte.classList.remove('est-active', 'entre', 'est-sortie', 'sortie', 'est-coupee');
    carte.setAttribute('aria-hidden', 'true');
    carte.inert = true;

    await attendre(ENTRE_CARTES);
  }
}

/** Passe au fragment suivant sur clic ou tap. */
function demanderSkip(e) {
  if (!enCours) return;
  if (e.target.closest('.univers__bouton')) return;
  libererAttente?.();
}

/** Passe au fragment suivant avec Entrée ou Espace. */
function surTouche(e) {
  // Ne jamais voler Entrée/Espace au bouton de fin.
  if (e.target.closest('.univers__bouton')) return;
  if (e.key !== 'Enter' && e.key !== ' ') return;

  e.preventDefault();
  demanderSkip(e);
}

/** Mode « animations réduites » : les quinze cartes sont affichées d'un coup. */
function afficherTout() {
  racine.classList.add('univers--statique');
  racine.setAttribute('aria-label', `Les Univers — ${cartes.length} fragments`);

  cartes.forEach((carte) => {
    chargerImage(carte);
    carte.setAttribute('aria-hidden', 'false');
    carte.inert = false;
  });

  revelerPied();
  annoncer('Les quinze univers sont affichés.');
}

export function init(conteneur) {
  const { univers } = mediasDeActe(3);
  if (!univers.length) {
    throw new Error('Acte 3 : aucun univers disponible dans assets.js');
  }

  conteneur.classList.add('acte--univers');
  conteneur.innerHTML = STRUCTURE(univers);

  racine = conteneur.querySelector('.univers');
  scene = conteneur.querySelector('.univers__scene');
  const pile = conteneur.querySelector('.univers__pile');
  cartes = Array.from(pile.children);
  note = conteneur.querySelector('.univers__note');
  bouton = conteneur.querySelector('.univers__bouton');

  bouton.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('acte:suivant'));
  });

  // Les trois premières images sont préchargées : la première doit être prête
  // avant l'entrée, les deux suivantes arrivent pendant la lecture.
  cartes.slice(0, 3).forEach(chargerImage);
}

export function enter() {
  enCours = true;
  const mien = ++jeton;

  // Si une ancienne séquence attendait encore, on la libère : elle se
  // terminera d'elle-même en voyant que son jeton n'est plus valide.
  libererAttente?.();
  libererAttente = null;

  racine.classList.remove('univers--statique');
  racine.setAttribute('aria-label', `Les Univers — ${cartes.length} fragments, un par un`);

  cartes.forEach((carte) => {
    carte.classList.remove('est-active', 'entre', 'est-sortie', 'sortie', 'est-coupee');
    carte.setAttribute('aria-hidden', 'true');
    carte.inert = true;
  });

  note.hidden = true;
  note.classList.remove('est-visible');

  bouton.hidden = true;
  bouton.disabled = true;
  bouton.classList.remove('est-visible');

  // Musique légèrement en retrait derrière les fragments.
  jouer();
  fonduVers(CONFIG.audio.volume * 0.7, 1200);

  if (mouvementReduit()) {
    afficherTout();
    return;
  }

  // Le clic/tap se fait sur la scène ; le clavier sur la région focusable,
  // qui englobe la scène et le pied de l'acte.
  scene.addEventListener('click', demanderSkip);
  racine.addEventListener('keydown', surTouche);

  jouerSequence(mien);
}

export function exit() {
  enCours = false;
  jeton += 1;

  libererAttente?.();
  libererAttente = null;

  if (scene) {
    scene.removeEventListener('click', demanderSkip);
  }

  racine?.removeEventListener('keydown', surTouche);

  racine?.classList.remove('univers--statique');

  cartes.forEach((carte) => {
    carte.classList.remove('est-active', 'entre', 'est-sortie', 'sortie', 'est-coupee');
    carte.setAttribute('aria-hidden', 'true');
    carte.inert = true;
  });

  if (note) {
    note.hidden = true;
    note.classList.remove('est-visible');
  }

  if (bouton) {
    bouton.hidden = true;
    bouton.disabled = true;
    bouton.classList.remove('est-visible');
  }
}
