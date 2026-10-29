/**
 * Acte 6 — Le Silence
 *
 * Tout s'arrête. L'écran devient le fond général, la musique se coupe,
 * puis une seule phrase apparaît. Aucun enchaînement automatique :
 * c'est elle qui décide de quitter le silence.
 */

import { fonduVers, pause } from '../core/audio-manager.js';
import { mouvementReduit, annoncer } from '../core/utils.js';

export const titre = 'Le Silence';

const PHRASE = "Merci d'exister.";

const STRUCTURE = `
  <div class="silence">
    <p class="silence__phrase" aria-hidden="true">${PHRASE}</p>
    <p class="sr-only">${PHRASE}</p>

    <div class="silence__pied">
      <button class="silence__suite" type="button" hidden>Continuer</button>
    </div>
  </div>
`;

let phrase = null;
let bouton = null;
let entete = null;
let points = null;
let minuteurs = [];
let session = 0;

export function init(conteneur) {
  conteneur.classList.add('acte--silence');
  conteneur.innerHTML = STRUCTURE;

  phrase = conteneur.querySelector('.silence__phrase');
  bouton = conteneur.querySelector('.silence__suite');
  entete = document.getElementById('entete');
  points = document.getElementById('points');

  bouton.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('acte:suivant'));
  });
}

export function enter() {
  const jeton = ++session;
  nettoyer();

  // Le noir doit être complet. L'acte 6 est monté dans #scene, sous l'en-tête
  // fixe : on masque donc explicitement l'en-tête et la progression. L'inert
  // évite en plus de laisser le bouton de son caché dans l'ordre du clavier.
  if (entete) {
    entete.inert = true;
    entete.classList.add('est-silence');
  }
  if (points) points.classList.add('est-silence');

  if (phrase) phrase.classList.remove('est-visible');
  if (bouton) {
    bouton.hidden = true;
    bouton.classList.remove('est-visible');
  }

  // Coupure nette mais pas brutale : 400 ms, puis on arrête vraiment le son.
  fonduVers(0, 400).then(() => {
    if (jeton === session) pause();
  });

  // 700 ms de fondu d'acte + 2 s de noir absolu avant la phrase.
  const delaiPhrase = mouvementReduit() ? 2000 : 2700;

  minuteurs.push(
    setTimeout(() => {
      if (jeton !== session) return;
      phrase?.classList.add('est-visible');
      annoncer(PHRASE);
    }, delaiPhrase)
  );

  // La phrase a fini son fondu (2 s) et reste 4 s avant que la suite soit
  // proposée. Aucun minuteur ne déclenche l'acte suivant.
  minuteurs.push(
    setTimeout(() => {
      if (jeton !== session || !bouton) return;
      bouton.hidden = false;
      requestAnimationFrame(() => bouton.classList.add('est-visible'));
    }, delaiPhrase + 6000)
  );
}

export function exit() {
  session += 1;
  nettoyer();

  // L'en-tête revient pour l'acte 7 (le son doit rester contrôlable).
  if (entete) {
    entete.inert = false;
    entete.classList.remove('est-silence');
  }
  if (points) points.classList.remove('est-silence');
}

function nettoyer() {
  minuteurs.forEach((minuteur) => clearTimeout(minuteur));
  minuteurs = [];
}
