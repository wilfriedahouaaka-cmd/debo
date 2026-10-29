/**
 * Acte 5 — Le Lien
 *
 * Trois fréquences convergent, sept lettres se croisent puis se posent.
 * Le prénom reste seul un instant avant que le message s'écrive.
 *
 * Aucun média : tout est texte et CSS. Les trajectoires sont fixes, jamais
 * tirées au hasard, pour que la scène soit identique à chaque lecture.
 */

import { CONFIG } from '../core/config.js';
import { jouer, fonduVers } from '../core/audio-manager.js';
import { mouvementReduit, attendre } from '../core/utils.js';
import { ecrire } from '../core/typewriter.js';

export const titre = 'Le Lien';

/** Texte exact du scénario, section 8. */
const MESSAGE =
  "Il y a des gens qui entrent dans ta vie comme une chanson. D'autres comme un combat. Et il y en a qui arrivent comme une série que tu ne savais pas que tu attendais.";

/**
 * Les sept lettres, avec leur couleur et leur trajectoire.
 * dx / dy : point de départ, par rapport à la position finale.
 * angle   : inclinaison de départ.
 * retard  : décalage de l'animation, pour que les lettres se croisent.
 */
const LETTRES = Object.freeze([
  { lettre: 'D', teinte: 'var(--c-rose)', dx: '-62vw', dy: '-24vh', angle: '-22deg', retard: '0ms' },
  { lettre: 'é', teinte: 'var(--c-accent)', dx: '48vw', dy: '-36vh', angle: '16deg', retard: '40ms' },
  { lettre: 'b', teinte: 'var(--c-violet-clair)', dx: '-34vw', dy: '42vh', angle: '12deg', retard: '80ms' },
  { lettre: 'o', teinte: 'var(--c-rose)', dx: '56vw', dy: '28vh', angle: '-14deg', retard: '120ms' },
  { lettre: 'r', teinte: 'var(--c-accent)', dx: '-20vw', dy: '-46vh', angle: '8deg', retard: '160ms' },
  { lettre: 'a', teinte: 'var(--c-violet-clair)', dx: '30vw', dy: '48vh', angle: '-18deg', retard: '200ms' },
  { lettre: 'h', teinte: 'var(--c-rose)', dx: '64vw', dy: '-8vh', angle: '20deg', retard: '240ms' },
]);

const STRUCTURE = `
  <div class="lien">
    <div class="lien__frequences" aria-hidden="true">
      <span class="lien__frequence lien__frequence--rose"></span>
      <span class="lien__frequence lien__frequence--or"></span>
      <span class="lien__frequence lien__frequence--violet"></span>
      <span class="lien__collision"></span>
    </div>

    <div class="lien__contenu">
      <p class="lien__nom">
        <span class="sr-only">Déborah</span>
        <span class="lien__mot" aria-hidden="true">
          ${LETTRES.map(
            (element) => `
              <span
                class="lien__lettre"
                style="--teinte: ${element.teinte}; --dx: ${element.dx}; --dy: ${element.dy}; --angle: ${element.angle}; --retard: ${element.retard}"
              >${element.lettre}</span>
            `
          ).join('')}
        </span>
      </p>

      <div class="lien__texte">
        <p class="lien__message" aria-hidden="true"></p>
        <p class="sr-only">${MESSAGE}</p>
      </div>

      <div class="lien__pied">
        <button class="lien__suite" type="button" hidden>Continuer</button>
      </div>
    </div>
  </div>
`;

let scene = null;
let message = null;
let bouton = null;
let minuteurs = [];
let controleur = null;
let session = 0;

export function init(conteneur) {
  conteneur.classList.add('acte--lien');
  conteneur.innerHTML = STRUCTURE;

  scene = conteneur.querySelector('.lien');
  message = conteneur.querySelector('.lien__message');
  bouton = conteneur.querySelector('.lien__suite');

  bouton.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('acte:suivant'));
  });
}

export function enter() {
  const jeton = ++session;
  nettoyer();

  // On remet la scène à zéro pour que les animations repartent si l'acte
  // est rouvert en mode debug.
  if (scene) scene.classList.remove('est-visible');
  if (bouton) {
    bouton.hidden = true;
    bouton.classList.remove('est-visible');
  }
  if (message) message.textContent = '';

  // Force le navigateur à recalculer les styles avant de relancer l'animation.
  if (scene) {
    void scene.offsetWidth;
    scene.classList.add('est-visible');
  }

  // La musique se stabilise au niveau de l'acte 4, puis se retirera après
  // la formation du prénom.
  jouer();
  fonduVers(CONFIG.audio.volume, 800);

  const reduit = mouvementReduit();
  const delai = reduit ? 600 : 4200;
  minuteurs.push(setTimeout(() => demarrerTexte(jeton), delai));
}

async function demarrerTexte(jeton) {
  if (jeton !== session) return;

  controleur = new AbortController();
  await ecrire(message, MESSAGE, {
    vitesse: 32,
    delai: 600,
    signal: controleur.signal,
  });

  if (jeton !== session) return;

  // La musique s'efface derrière le message.
  fonduVers(CONFIG.audio.volume * 0.35, 2500);

  // On ne propose la suite qu'une fois le texte posé.
  await attendre(1500);
  if (jeton !== session || !bouton) return;

  bouton.hidden = false;
  requestAnimationFrame(() => bouton.classList.add('est-visible'));
}

export function exit() {
  session += 1;
  nettoyer();
}

function nettoyer() {
  minuteurs.forEach((minuteur) => clearTimeout(minuteur));
  minuteurs = [];

  if (controleur) {
    controleur.abort();
    controleur = null;
  }
}
