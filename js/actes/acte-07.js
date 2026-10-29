/**
 * Acte 7 — La Fin
 *
 * L'écran se rallume à peine. Trois battements, une lettre qui s'écrit,
 * une signature, puis le lien WhatsApp. La musique revient très bas et
 * s'éteint complètement avant de laisser la place à la conversation.
 */

import { CONFIG } from '../core/config.js';
import { jouer, fonduVers, pause } from '../core/audio-manager.js';
import { mouvementReduit, attendre, annoncer } from '../core/utils.js';
import { ecrire } from '../core/typewriter.js';

export const titre = 'La Fin';

/** Corps de la lettre, sans la salutation ni la signature. */
const MESSAGE =
  "Je voulais te faire ressentir un peu de tout ce que tu représentes. Pas juste avec des mots, mais avec ce que tu aimes, ce qui te ressemble, et ce qui me rappelle pourquoi tu comptes.\n\nMerci d'être entrée dans ma vie. Merci d'exister exactement comme tu es.";

/** Lien final : aucune conversation pré-remplie, aucun texte dans l'URL. */
const WHATSAPP = 'https://wa.me/2250143928168';

const STRUCTURE = `
  <div class="fin">
    <div class="fin__coeur" aria-hidden="true"></div>

    <div class="fin__lettre">
      <p class="fin__salutation">Déborah,</p>

      <p class="fin__texte" aria-hidden="true"></p>
      <p class="sr-only">${MESSAGE}</p>

      <p class="fin__signature">— Wilfried</p>
    </div>

    <div class="fin__pied">
      <a
        class="fin__bouton"
        href="${WHATSAPP}"
        target="_blank"
        rel="noopener noreferrer"
        hidden
      >Me dire ce que tu as ressenti</a>
    </div>
  </div>
`;

let scene = null;
let texte = null;
let signature = null;
let bouton = null;
let minuteurs = [];
let controleur = null;
let session = 0;

export function init(conteneur) {
  conteneur.classList.add('acte--fin');
  conteneur.innerHTML = STRUCTURE;

  scene = conteneur.querySelector('.fin');
  texte = conteneur.querySelector('.fin__texte');
  signature = conteneur.querySelector('.fin__signature');
  bouton = conteneur.querySelector('.fin__bouton');
}

export function enter() {
  const jeton = ++session;
  nettoyer();

  if (scene) scene.classList.remove('est-visible');
  if (texte) texte.textContent = '';
  if (signature) signature.classList.remove('est-visible');
  if (bouton) {
    bouton.hidden = true;
    bouton.classList.remove('est-visible');
  }

  // Relance les trois pulsations et le fondu de la salutation.
  if (scene) {
    void scene.offsetWidth;
    scene.classList.add('est-visible');
  }

  // Retour très discret de la musique, puis extinction à la fin.
  jouer();
  fonduVers(CONFIG.audio.volume * 0.2, 2000);

  const reduit = mouvementReduit();
  const delai = reduit ? 600 : 2400;
  minuteurs.push(setTimeout(() => demarrerTexte(jeton), delai));
}

async function demarrerTexte(jeton) {
  if (jeton !== session) return;

  controleur = new AbortController();
  await ecrire(texte, MESSAGE, {
    vitesse: 34,
    delai: 0,
    signal: controleur.signal,
  });

  if (jeton !== session) return;

  // La signature apparaît seule, après la dernière phrase.
  await attendre(800);
  if (jeton !== session || !signature) return;
  signature.classList.add('est-visible');

  // Puis le bouton, 1,5 s plus tard : jamais avant la fin du texte.
  await attendre(1500);
  if (jeton !== session || !bouton) return;

  bouton.hidden = false;
  requestAnimationFrame(() => bouton.classList.add('est-visible'));
  annoncer('Le bouton pour répondre sur WhatsApp est disponible.');

  // La musique s'éteint complètement, sans coupure brutale.
  fonduVers(0, 1800).then(() => {
    if (jeton === session) pause();
  });
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
