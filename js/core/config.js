/**
 * Constantes globales de l'expérience.
 * Un seul endroit à modifier pour régler le rythme, le son et le debug.
 */

export const CONFIG = Object.freeze({
  version: '1.0.0',

  // Production : coupe les traces console et ignore ?acte= dans l'URL.
  debug: false,

  actes: Object.freeze({
    total: 7,
    premier: 1,
  }),

  prechargement: Object.freeze({
    // Durée minimale d'affichage : évite un flash si tout est déjà en cache
    delaiMinimum: 800,
    // Au-delà, on n'attend plus et on affiche l'expérience (média manquant toléré)
    delaiMaximum: 20000,
  }),

  audio: Object.freeze({
    volume: 0.4,
    fonduEntree: 2000,
    fonduSortie: 1000,
    boucle: true,
  }),

  /**
   * Durées pilotées en JavaScript (en millisecondes).
   * À garder alignées avec --dur-scene et --dur-acte dans css/base/variables.css.
   */
  transitions: Object.freeze({
    dureeScene: 700,
    dureeActe: 1200,
  }),

  navigation: Object.freeze({
    clavier: true,
    molette: true,
    geste: true,
    seuilGeste: 50, // pixels avant de valider un balayage tactile
  }),

  accessibilite: Object.freeze({
    respecterMouvementReduit: true,
  }),
});
