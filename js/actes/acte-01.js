/**
 * Acte 1 — Le Signal
 *
 * Une vieille radio cherche sa station. La fréquence dérive, l'aiguille
 * balaie le cadran, un témoin bat. Un seul geste : allumer.
 * Le signal se verrouille, la station apparaît, le message arrive.
 *
 * C'est aussi ce clic qui autorise le navigateur à jouer du son plus tard.
 */

import { mouvementReduit, annoncer } from '../core/utils.js';
import { deverrouiller } from '../core/audio-manager.js';

export const titre = 'Le Signal';

const DEPART = 87.4;
const FINALE = 94.2;
const MINIMUM = 86.0;
const MAXIMUM = 99.9;

const STRUCTURE = `
  <div class="signal">
    <div class="signal__grille">
      <button class="radio" type="button" aria-label="Allumer la radio">
        <span class="radio__aura" aria-hidden="true"></span>

        <span class="radio__boite">
          <span class="radio__haut">
            <span class="radio__temoin" aria-hidden="true"></span>
            <span class="radio__bande">
              FM <span class="radio__frequence">87.4</span> — <span class="radio__etat">recherche</span>
            </span>
            <span class="radio__voyants" aria-hidden="true"><i></i><i></i><i></i></span>
          </span>

          <span class="radio__milieu">
            <span class="radio__grille" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i>
            </span>
            <span class="radio__cadran" aria-hidden="true">
              <span class="radio__aiguille"></span>
              <span class="radio__axe"></span>
            </span>
          </span>

          <span class="radio__bas">
            <span class="radio__molette">vol</span>
            <span class="radio__leds" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="radio__molette">ton</span>
          </span>
        </span>
      </button>

      <div class="signal__texte">
        <p class="signal__etat">
          <span class="signal__point" aria-hidden="true"></span>
          <span class="signal__etat-texte">Signal interrompu · Connexion requise</span>
        </p>

        <h1 class="signal__titre">Une fréquence t'attend.</h1>

        <p class="signal__sous-titre">
          Un murmure à travers le bruit numérique. Stabilise l'onde pour révéler
          ce qui a été préparé pour toi.
        </p>

        <div class="signal__actions">
          <button class="signal__bouton" type="button">
            Allumer <span class="signal__fleche" aria-hidden="true">→</span>
          </button>
          <p class="signal__aide">Clique pour stabiliser</p>
        </div>

        <p class="signal__succes" aria-hidden="true">
          « Fréquence captée. Bienvenue, Déborah. »
        </p>
      </div>
    </div>

    <p class="signal__pied">
      <span class="signal__onde" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="signal__pied-texte">Signal 87.4 MHz — recherche</span>
    </p>
  </div>
`;

/**
 * Écran noir d'avant-radio.
 * Les positions sont volontairement dispersées : des étincelles alignées
 * ressembleraient à un motif décoratif, pas à un signal qui cherche.
 * Un peu plus nombreuses, un peu plus vives, un peu plus longues.
 */
const INTRO = `
  <span class="signal-intro__etincelle" style="--x: 18%; --y: 32%; --retard: 80ms; --duree: 2.2s;"></span>
  <span class="signal-intro__etincelle" style="--x: 72%; --y: 25%; --retard: 220ms; --duree: 2.0s;"></span>
  <span class="signal-intro__etincelle" style="--x: 38%; --y: 55%; --retard: 40ms; --duree: 2.4s;"></span>
  <span class="signal-intro__etincelle" style="--x: 78%; --y: 61%; --retard: 560ms; --duree: 2.1s;"></span>
  <span class="signal-intro__etincelle" style="--x: 28%; --y: 68%; --retard: 320ms; --duree: 2.3s;"></span>
  <span class="signal-intro__etincelle" style="--x: 62%; --y: 16%; --retard: 720ms; --duree: 1.9s;"></span>
  <span class="signal-intro__etincelle" style="--x: 45%; --y: 42%; --retard: 900ms; --duree: 2.0s;"></span>
  <span class="signal-intro__etincelle" style="--x: 15%; --y: 52%; --retard: 1100ms; --duree: 1.8s;"></span>
  <span class="signal-intro__etincelle" style="--x: 85%; --y: 45%; --retard: 1300ms; --duree: 1.7s;"></span>
  <span class="signal-intro__etincelle" style="--x: 52%; --y: 78%; --retard: 1500ms; --duree: 1.6s;"></span>

  <span class="signal-intro__eclair" style="--x: 48%; --y: 28%; --retard: 400ms; --h: 34px; --r: 12deg;"></span>
  <span class="signal-intro__eclair" style="--x: 55%; --y: 58%; --retard: 850ms; --h: 22px; --r: -18deg;"></span>
  <span class="signal-intro__eclair" style="--x: 32%; --y: 38%; --retard: 1200ms; --h: 18px; --r: 22deg;"></span>
`;


let racine = null;
let radio = null;
let bouton = null;
let frequence = null;
let etat = null;
let etatTexte = null;
let piedTexte = null;
let succes = null;
let derive = null;
let intro = null;
let entete = null;
let minuteurs = [];
let verrouille = false;

/** setTimeout dont on garde la trace pour tout annuler à la sortie. */
function planifier(callback, delai) {
  const identifiant = setTimeout(callback, delai);
  minuteurs.push(identifiant);
  return identifiant;
}

function annulerMinuteurs() {
  minuteurs.forEach((identifiant) => clearTimeout(identifiant));
  minuteurs = [];
}

export function init(conteneur) {
  conteneur.classList.add('acte--signal');
  conteneur.innerHTML = STRUCTURE;

  racine = conteneur;
  radio = conteneur.querySelector('.radio');
  bouton = conteneur.querySelector('.signal__bouton');
  frequence = conteneur.querySelector('.radio__frequence');
  etat = conteneur.querySelector('.radio__etat');
  etatTexte = conteneur.querySelector('.signal__etat-texte');
  piedTexte = conteneur.querySelector('.signal__pied-texte');
  succes = conteneur.querySelector('.signal__succes');

  // Le voile noir existe déjà dans index.html : il est présent dès le premier
  // rendu pour que la nébuleuse n'apparaisse jamais entre le préchargement et
  // la radio. On ne crée un secours que si le HTML a été modifié.
  intro = document.getElementById('signal-intro');

  if (!intro) {
    intro = document.createElement('div');
    intro.id = 'signal-intro';
    intro.className = 'signal-intro';
    intro.setAttribute('aria-hidden', 'true');
    document.body.append(intro);
  }

  intro.innerHTML = INTRO;
  intro.classList.remove('est-parti');
  intro.hidden = false;

  entete = document.getElementById('entete');

  radio.addEventListener('click', stabiliser);
  bouton.addEventListener('click', stabiliser);
}

export function enter() {
  verrouille = false;
  racine.classList.remove('est-verrouille', 'est-accueil', 'est-intro');
  annulerMinuteurs();

  // Les commandes restent inactives pendant le noir d'entrée.
  radio.disabled = true;
  radio.setAttribute('aria-label', 'Allumer la radio');
  bouton.disabled = true;

  frequence.textContent = DEPART.toFixed(1);
  etat.textContent = 'recherche';
  etatTexte.textContent = 'Signal interrompu · Connexion requise';
  piedTexte.textContent = 'Signal 87.4 MHz — recherche';
  succes.setAttribute('aria-hidden', 'true');

  demarrerDerive();
  demarrerIntro();
}

export function exit() {
  arreterDerive();
  annulerMinuteurs();
  arreterIntro();
}

/**
 * Prépare le noir : quelques points de lumière, aucun texte.
 * La durée est courte ; l'expérience ne doit pas commencer par une attente.
 */
function demarrerIntro() {
  if (!intro) {
    radio.disabled = false;
    bouton.disabled = false;
    return;
  }

  // Le voile est déjà visible depuis le premier rendu : on ne le masque pas
  // ici, sinon la nébuleuse réapparaîtrait une fraction de seconde.
  intro.classList.remove('est-parti');
  racine.classList.remove('est-intro');

  if (mouvementReduit()) {
    intro.hidden = true;
    if (entete) entete.inert = false;
    radio.disabled = false;
    bouton.disabled = false;
    return;
  }

  intro.hidden = false;
  racine.classList.add('est-intro');
  if (entete) entete.inert = true;

  // Force la réinitialisation des animations CSS des étincelles.
  void intro.offsetWidth;

  // Les étincelles ont le temps de respirer avant que la radio n'émerge.
  // Durée allongée pour que l'animation soit plus vivante.
  planifier(() => {
    intro.classList.add('est-parti');
    racine.classList.remove('est-intro');
  }, 2200);

  planifier(() => {
    intro.hidden = true;
    if (entete) entete.inert = false;
    if (!verrouille) {
      radio.disabled = false;
      bouton.disabled = false;
    }
  }, 3500);
}

/** Coupe proprement l'entrée si l'acte est quitté avant la fin. */
function arreterIntro() {
  if (intro) {
    intro.hidden = true;
    intro.classList.remove('est-parti');
  }

  racine?.classList.remove('est-intro');
  if (entete) entete.inert = false;
}

/** La fréquence cherche sa station : petite marche aléatoire, jamais continue. */
function demarrerDerive() {
  arreterDerive();

  const intervalle = mouvementReduit() ? 900 : 180;
  let valeur = DEPART;

  derive = setInterval(() => {
    valeur = Math.min(Math.max(valeur + (Math.random() * 2.4 - 1.2), MINIMUM), MAXIMUM);
    frequence.textContent = valeur.toFixed(1);
  }, intervalle);
}

function arreterDerive() {
  if (derive) clearInterval(derive);
  derive = null;
}

/**
 * Le geste unique de l'acte.
 * L'aiguille se pose, la fréquence se fige, la lumière monte, puis la phrase.
 */
async function stabiliser() {
  if (verrouille) return;
  verrouille = true;

  arreterDerive();
  annulerMinuteurs();

  racine.classList.add('est-verrouille');

  radio.disabled = true;
  radio.setAttribute('aria-label', 'Radio verrouillée');
  bouton.disabled = true;

  frequence.textContent = FINALE.toFixed(1);
  etat.textContent = 'résonance';
  etatTexte.textContent = 'Fréquence captée · Connexion établie';
  piedTexte.textContent = 'Signal 94.2 MHz verrouillé';
  succes.setAttribute('aria-hidden', 'false');

  // Geste utilisateur : c'est maintenant que le son est autorisé pour la suite
  await deverrouiller();

  const reduit = mouvementReduit();

  planifier(() => racine.classList.add('est-accueil'), reduit ? 100 : 250);
  annoncer('Fréquence captée. Bienvenue, Déborah.');

  planifier(
    () => document.dispatchEvent(new CustomEvent('acte:suivant')),
    reduit ? 1200 : 3000
  );
}
