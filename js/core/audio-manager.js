/**
 * Gestion unique du son de l'expérience.
 *
 * Aucun acte ne crée son propre élément audio : tout passe par ce module.
 * Un seul morceau traverse les sept actes, son volume change selon le récit.
 */

import { AUDIO } from './assets.js';

let element = null;
let deverrouille = false;
let animation = null;
let muet = false;
let volumeVoulu = 0;

/** Applique le volume voulu, en tenant compte de la sourdine. */
function appliquerVolume() {
  if (!element) return;
  element.volume = muet ? 0 : Math.min(Math.max(volumeVoulu, 0), 1);
}

/** Crée l'élément audio une seule fois, à la demande. */
function obtenirElement() {
  if (element) return element;

  element = new Audio(AUDIO.principal.fichier);
  element.loop = AUDIO.principal.boucle;
  element.preload = 'metadata';
  element.volume = 0; // le son n'arrive qu'à l'acte 2
  return element;
}

/**
 * Déverrouille l'audio du navigateur.
 * Doit être appelé dans un vrai geste de l'utilisateur (le clic de l'acte 1).
 * Sans cela, aucune musique ne pourra démarrer plus tard.
 */
export async function deverrouiller() {
  if (deverrouille) return true;

  const audio = obtenirElement();

  try {
    audio.volume = 0;
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    deverrouille = true;
    return true;
  } catch (erreur) {
    console.warn('[fréquences] Audio bloqué par le navigateur :', erreur);
    return false;
  }
}

export function estDeverrouille() {
  return deverrouille;
}

/** Lance la lecture sans changer le volume. */
export function jouer() {
  const audio = obtenirElement();
  if (audio.paused) {
    audio.play().catch(() => {
      // Échec silencieux : l'expérience reste lisible sans son
    });
  }
}

export function pause() {
  if (element) element.pause();
}

/**
 * Règle le volume immédiatement, sans fondu.
 * Utilisé quand une valeur suit le scroll image par image (acte 2).
 */
export function definirVolume(valeur) {
  const audio = obtenirElement();
  if (animation) {
    cancelAnimationFrame(animation);
    animation = null;
  }
  volumeVoulu = Math.min(Math.max(valeur, 0), 1);
  appliquerVolume();
}

/** Vrai tant que le son n'est pas coupé. */
export function sonActif() {
  return !muet;
}

/**
 * Coupe ou rétablit le son sans arrêter la lecture.
 * Le morceau continue sa course : on ne perd pas la position.
 */
export function basculerSon() {
  muet = !muet;
  appliquerVolume();
  return !muet;
}

/**
 * Fait glisser le volume jusqu'à une valeur cible.
 * La durée est en millisecondes ; on anime avec requestAnimationFrame
 * pour rester fluide et solidaire de l'affichage.
 */
export function fonduVers(cible, duree = 1000) {
  const audio = obtenirElement();
  if (animation) cancelAnimationFrame(animation);

  volumeVoulu = Math.min(Math.max(cible, 0), 1);
  const volumeCible = muet ? 0 : volumeVoulu;
  const depart = Math.min(Math.max(audio.volume, 0), 1);
  const debut = performance.now();
  // Une durée nulle ou négative ne doit pas bloquer la promesse.
  const dureeSure = Math.max(duree, 1);

  return new Promise((resoudre) => {
    function etape(maintenant) {
      // L'horodatage de requestAnimationFrame peut être légèrement antérieur
      // à performance.now() : sans borne basse, la progression devient
      // négative et le volume sort de l'intervalle [0, 1].
      const progression = Math.min(Math.max((maintenant - debut) / dureeSure, 0), 1);
      const volume = depart + (volumeCible - depart) * progression;
      audio.volume = muet ? 0 : Math.min(Math.max(volume, 0), 1);

      if (progression < 1) {
        animation = requestAnimationFrame(etape);
      } else {
        animation = null;
        resoudre();
      }
    }

    animation = requestAnimationFrame(etape);
  });
}
