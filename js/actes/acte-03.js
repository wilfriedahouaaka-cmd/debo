/**
 * Acte 3 — Les Univers
 *
 * Quinze fragments de ce qu'elle aime, dans l'ordre du scénario :
 * musique, animé, série, sans tri par catégorie — un tri ferait catalogue.
 *
 * Chaque carte porte une catégorie courte et une phrase.
 * Les huit premières phrases viennent de la référence Stitch.
 * Les sept autres sont des propositions à corriger avec Wilfried.
 *
 * NOUVEAU : présentation séquentielle — une carte à la fois, avec animation
 * d'entrée (loin → près, flou → net), pause, puis sortie pour la suivante.
 */

import { mediasDeActe } from '../core/assets.js';
import { CONFIG } from '../core/config.js';
import { jouer, fonduVers } from '../core/audio-manager.js';
import { mouvementReduit, attendre } from '../core/utils.js';

export const titre = 'Les Univers';

/**
 * Catégorie affichée sur le visuel + phrase de la carte.
 * Si un univers n'est pas décrit ici, la carte reste affichée avec sa famille.
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

/** Durée de vie d'une carte (ms) : entrée + pause + sortie. */
const DUREE_CARTE = 3500;
/** Pause entre la fin de sortie d'une carte et l'entrée de la suivante (ms). */
const ENTRE_CARTES = 400;

/** Génère le HTML d'une carte (identique visuellement à l'ancien, mais dans la scène). */
function carteHTML(univers, index) {
  const detail = DETAILS[univers.id] ?? {};
  const categorie = detail.categorie ?? univers.famille;
  const phrase = detail.phrase ?? '';

  return `
    <li class="univers__carte" data-index="${index}" data-famille="${univers.famille}" style="--teinte: ${getTeinte(univers.famille)};">
      <figure class="univers__visuel">
        <img
          data-src="${univers.fichier}"
          alt=""
          width="${univers.largeur}"
          height="${univers.hauteur}"
          loading="lazy"
          decoding="async"
        >
        <figcaption class="univers__etiquette">${categorie}</figcaption>
      </figure>

      <div class="univers__contenu">
        <h2 class="univers__nom">${univers.titre}</h2>
        ${phrase ? `<p class="univers__phrase">${phrase}</p>` : ''}
      </div>
    </li>
  `;
}

/** Renvoie la valeur RGB de la teinte selon la famille. */
function getTeinte(famille) {
  switch (famille) {
    case 'musique': return '216 184 120';
    case 'serie': return '209 152 166';
    case 'anime': return '166 152 214';
    default: return '196 168 106'; // --c-lueur fallback
  }
}

const STRUCTURE = (univers) => `
  <div
    class="univers"
    tabindex="0"
    role="region"
    aria-label="Les Univers — découvre les quinze fragments un par un"
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

    <!-- Scène où les cartes défilent une par une -->
    <div class="univers__scene" aria-live="polite" aria-atomic="true">
      <ul class="univers__pile">
        ${univers.map((u, i) => carteHTML(u, i)).join('')}
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
let pile = null;
let cartes = [];
let enCours = false;
let minuteurs = [];

/** setTimeout dont on garde la trace pour tout annuler à la sortie. */
function planifier(callback, delai) {
  const id = setTimeout(callback, delai);
  minuteurs.push(id);
  return id;
}

function annulerMinuteurs() {
  minuteurs.forEach(id => clearTimeout(id));
  minuteurs = [];
}

export function init(conteneur) {
  const { univers } = mediasDeActe(3);
  if (!univers.length) {
    throw new Error('Acte 3 : aucun univers disponible dans assets.js');
  }

  conteneur.classList.add('acte--univers');
  conteneur.innerHTML = STRUCTURE(univers);

  racine = conteneur;
  pile = conteneur.querySelector('.univers__pile');
  cartes = Array.from(pile.children);

  // Précharge les 4 premières images (les autres sont lazy)
  cartes.slice(0, 4).forEach(li => {
    const img = li.querySelector('img[data-src]');
    if (img) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  });

  conteneur.querySelector('.univers__bouton').addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('acte:suivant'));
  });
}

export async function enter() {
  annulerMinuteurs();

  // Remet la pile au début
  const zone = racine?.querySelector('.univers');
  if (zone) zone.scrollTop = 0;

  // Réinitialise l'état visuel de toutes les cartes
  cartes.forEach((carte, i) => {
    carte.style.removeProperty('--delay');
    carte.classList.remove('est-active', 'est-sortie', 'est-finie', 'entre', 'sortie', 'est-finale');
    carte.hidden = false;
    carte.style.pointerEvents = 'none';
  });

  // Affiche le pied (note + bouton) seulement à la fin
  const pied = racine.querySelector('.univers__pied');
  const note = pied?.querySelector('.univers__note');
  const bouton = pied?.querySelector('.univers__bouton');
  if (note) note.hidden = true;
  if (bouton) {
    bouton.hidden = true;
    bouton.disabled = true;
  }

  // Musique : légèrement en retrait derrière les fragments
  jouer();
  fonduVers(CONFIG.audio.volume * 0.7, 1200);

  // Si mouvement réduit : on affiche toutes les cartes d'un coup (grille)
  if (mouvementReduit()) {
    afficherGrilleComplete();
    return;
  }

  // Clic/tap sur la scène = passer à la carte suivante (skip)
  const scene = racine.querySelector('.univers__scene');
  if (scene) {
    scene.addEventListener('click', gererSkip);
    scene.addEventListener('keydown', gererSkipClavier);
  }

  // Lance la séquence séquentielle
  enCours = true;
  await jouerSequence();
}

function afficherGrilleComplete() {
  // Mode réduit : on remet en grille statique (toutes visibles)
  pile.style.display = 'grid';
  pile.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
  pile.style.gap = 'var(--sp-4)';
  pile.style.maxWidth = '72rem';
  pile.style.marginInline = 'auto';
  pile.style.padding = '0';
  pile.style.listStyle = 'none';

  cartes.forEach((carte, i) => {
    carte.style.opacity = '1';
    carte.style.transform = 'none';
    carte.style.filter = 'none';
    const img = carte.querySelector('img[data-src]');
    if (img) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  });

  // Affiche le pied
  const note = racine.querySelector('.univers__note');
  const bouton = racine.querySelector('.univers__bouton');
  if (note) note.hidden = false;
  if (bouton) bouton.hidden = false;
}

async function jouerSequence() {
  for (let i = 0; i < cartes.length; i++) {
    if (!enCours) break; // interrompu par exit()

    const carte = cartes[i];

    // Précharge l'image de cette carte si pas encore fait
    const img = carte.querySelector('img[data-src]');
    if (img) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      // Attend que l'image soit décodée (max 2s)
      try {
        await Promise.race([
          img.decode ? img.decode() : Promise.resolve(),
          attendre(2000),
        ]);
      } catch {}
    }

    // Masque les autres cartes pendant l'animation de celle-ci
    cartes.forEach((c, j) => {
      if (j !== i) c.hidden = true;
    });
    carte.hidden = false;

    // --- ENTRÉE ---
    carte.classList.add('est-active');
    // Force le reflow pour déclencher l'animation
    void carte.offsetWidth;
    carte.classList.add('entre');

    // Attend la fin de l'entrée + pause
    await attendreFinAnimation(carte, 'entree');

    // --- SORTIE ---
    carte.classList.remove('entre');
    carte.classList.add('est-sortie');
    void carte.offsetWidth;
    carte.classList.add('sortie');

    await attendreFinAnimation(carte, 'sortie');

    carte.classList.add('est-finie');
    carte.hidden = true;

    // Pause entre les cartes (sauf après la dernière)
    if (i < cartes.length - 1 && enCours) {
      await attendre(ENTRE_CARTES);
    }
  }

  if (!enCours) return;

  // --- FIN DE SÉQUENCE ---
  // On remet la pile en grille statique pour le scroll final (optionnel)
  // Ici on garde l'effet "carte finale" puis on montre le pied
  const derniere = cartes[cartes.length - 1];
  if (derniere) {
    derniere.hidden = false;
    derniere.classList.remove('est-finie', 'est-sortie', 'sortie');
    derniere.classList.add('est-active', 'est-finale');
  }

  // Affiche la note et le bouton
  const note = racine.querySelector('.univers__note');
  const bouton = racine.querySelector('.univers__bouton');
  if (note) {
    note.hidden = false;
    void note.offsetWidth;
    note.classList.add('est-visible');
  }
  if (bouton) {
    bouton.hidden = false;
    void bouton.offsetWidth;
    bouton.classList.add('est-visible');
  }
}

/** Attend la fin d'une animation CSS (entree ou sortie) via transitionend. */
function attendreFinAnimation(element, type) {
  return new Promise(resolve => {
    const duree = type === 'entree' ? 1200 : 1000; // doit correspondre au CSS
    const timeout = setTimeout(() => {
      element.removeEventListener('transitionend', handler);
      resolve();
    }, duree + 200);

    const handler = (e) => {
      if (e.target !== element) return;
      if (e.propertyName === 'transform' || e.propertyName === 'opacity' || e.propertyName === 'filter') {
        clearTimeout(timeout);
        element.removeEventListener('transitionend', handler);
        resolve();
      }
    };
    element.addEventListener('transitionend', handler);
  });
}

export function exit() {
  enCours = false;
  annulerMinuteurs();

  const scene = racine?.querySelector('.univers__scene');
  if (scene) {
    scene.removeEventListener('click', gererSkip);
    scene.removeEventListener('keydown', gererSkipClavier);
  }

  // Nettoyage visuel
  cartes.forEach(carte => {
    carte.classList.remove('est-active', 'est-sortie', 'est-finie', 'entre', 'sortie', 'est-finale');
    carte.style.removeProperty('--delay');
    carte.hidden = false;
    carte.style.pointerEvents = '';
  });

  if (pile) {
    pile.style.removeProperty('display');
    pile.style.removeProperty('gridTemplateColumns');
    pile.style.removeProperty('gap');
    pile.style.removeProperty('maxWidth');
    pile.style.removeProperty('marginInline');
    pile.style.removeProperty('padding');
    pile.style.removeProperty('listStyle');
  }
}

/** Passe à la carte suivante sur clic/tap (skip). */
function gererSkip(e) {
  if (!enCours) return;
  // Ignore les clics sur le bouton final
  if (e.target.closest('.univers__bouton')) return;
  passerCarteSuivante();
}

/** Passe à la carte suivante sur Entrée/Espace (skip clavier). */
function gererSkipClavier(e) {
  if (!enCours) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    passerCarteSuivante();
  }
}

/** Force le passage à la carte suivante (annule l'actuelle). */
function passerCarteSuivante() {
  // Trouve la carte actuellement active
  const indexActif = cartes.findIndex(c => c.classList.contains('est-active') && !c.classList.contains('est-finie'));
  if (indexActif >= 0) {
    // Force la fin de l'animation courante
    const carte = cartes[indexActif];
    carte.classList.remove('entre');
    carte.classList.add('est-sortie');
    void carte.offsetWidth;
    carte.classList.add('sortie');
    // La suite sera gérée par jouerSequence au tour suivant
  }
}