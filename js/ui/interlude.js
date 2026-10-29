/**
 * Intermède entre l'acte 1 et l'acte 2.
 *
 * Séquence : le premier message sur le noir, un vrai temps de noir, une
 * convergence de points vers le centre, puis le second message seul.
 * L'acte 2 est déjà monté derrière : le fondu de sortie de l'intermède
 * révèle directement sa photo floue, sans coupure.
 *
 * Aucun autre passage d'acte n'utilise ce module pour l'instant.
 */

import { annoncer } from '../core/utils.js';

const MESSAGE_UN = 'Ah, te voilà enfin arrivée. Bienvenue.';
const MESSAGE_DEUX =
  "Te voilà enfin arrivée ici. J'espère que cette expérience va être belle et que tu pourras l'aimer.";

const NOMBRE_POINTS = 22;

let racine = null;
let minuteurs = [];
let enCours = false;
let resoudre = null;

/* --- Outils -------------------------------------------------------------- */

function planifier(callback, delai) {
  minuteurs.push(setTimeout(callback, delai));
}

function annulerMinuteurs() {
  minuteurs.forEach((identifiant) => clearTimeout(identifiant));
  minuteurs = [];
}

/**
 * Crée les points qui convergeront vers le centre.
 * Les positions de départ sont tirées autour du centre, en vmin : les points
 * restent dans l'écran, même sur un téléphone vertical. Sans cette marge,
 * ils naissaient hors cadre et la convergence semblait déjà terminée.
 */
function creerPoints() {
  const conteneur = document.createElement('div');
  conteneur.className = 'interlude__points';

  const teintes = [
    'var(--c-accent)',
    'var(--c-accent-soft)',
    'var(--c-signal)',
    'var(--c-accent)',
    'var(--c-accent-soft)',
  ];

  for (let i = 0; i < NOMBRE_POINTS; i += 1) {
    const angle = (i / NOMBRE_POINTS) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const rayon = 24 + Math.random() * 18;
    const taille = 3 + Math.random() * 2.5;

    const point = document.createElement('i');
    point.className = 'interlude__point';
    point.style.setProperty('--dx', `${(Math.cos(angle) * rayon).toFixed(1)}vmin`);
    point.style.setProperty('--dy', `${(Math.sin(angle) * rayon).toFixed(1)}vmin`);
    point.style.setProperty('--taille', `${taille.toFixed(1)}px`);
    point.style.setProperty('--retard', `${Math.round(Math.random() * 300)}ms`);
    point.style.setProperty('--duree', `${2000 + Math.round(Math.random() * 400)}ms`);
    point.style.setProperty('--teinte', teintes[i % teintes.length]);
    point.style.setProperty('--opacite', (0.6 + Math.random() * 0.3).toFixed(2));

    conteneur.append(point);
  }

  return conteneur;
}

/** Construit l'intermède. */
function construire() {
  const element = document.createElement('div');
  element.className = 'interlude';
  element.setAttribute('aria-hidden', 'true');

  element.innerHTML = `
    <div class="interlude__convergence">
      <span class="interlude__lueur"></span>
      <span class="interlude__anneau interlude__anneau--un"></span>
      <span class="interlude__anneau interlude__anneau--deux"></span>
      <span class="interlude__coeur"></span>
    </div>
    <p class="interlude__message interlude__message--un">${MESSAGE_UN}</p>
    <p class="interlude__message interlude__message--deux">${MESSAGE_DEUX}</p>
  `;

  element.querySelector('.interlude__convergence').append(creerPoints());

  return element;
}

/* --- Déroulé ------------------------------------------------------------- */

function terminer() {
  annulerMinuteurs();

  const element = racine;
  racine = null;
  enCours = false;

  if (element) element.remove();

  const fin = resoudre;
  resoudre = null;
  if (fin) fin();
}

/** Coupe l'intermède immédiatement (utilisé à la sortie de l'acte 2). */
export function arreterInterlude() {
  terminer();
}

/**
 * Joue l'intermède et renvoie une promesse résolue quand l'écran est rendu
 * à l'acte 2.
 */
export function jouerInterlude() {
  if (enCours) arreterInterlude();

  enCours = true;
  racine = construire();
  document.body.append(racine);

  return new Promise((resolve) => {
    resoudre = resolve;

    const messageUn = racine.querySelector('.interlude__message--un');
    const messageDeux = racine.querySelector('.interlude__message--deux');

    // 1. Premier message, sur le noir.
    planifier(() => {
      messageUn.classList.add('est-visible');
      annoncer(MESSAGE_UN);
    }, 500);

    // 2. Il s'efface : on laisse un vrai noir avant la convergence.
    planifier(() => messageUn.classList.remove('est-visible'), 3200);

    // 3. Convergence vers le centre.
    planifier(() => racine.classList.add('est-convergence'), 4700);

    // 4. La convergence s'efface une fois tous les points arrivés :
    //    dernier départ 4700 + 2400 de course + 300 de retard = 7400.
    planifier(() => racine.classList.add('est-fini'), 7600);

    // 5. Second message, sur le noir. On attend la fin du fondu de la
    //    convergence pour qu'il apparaisse vraiment seul.
    planifier(() => {
      messageDeux.classList.add('est-visible');
      annoncer(MESSAGE_DEUX);
    }, 8200);

    // 6. Temps de lecture, puis disparition.
    planifier(() => messageDeux.classList.remove('est-visible'), 13800);

    // 7. Fondu du noir vers l'acte 2, déjà prêt derrière.
    planifier(() => racine.classList.add('est-sortie'), 14600);
    planifier(terminer, 15400);
  });
}
