/**
 * Petits utilitaires partagés.
 * Aucune dépendance, aucun effet de bord : uniquement des fonctions pures
 * ou des accès simples au document.
 */

/** Attend un nombre de millisecondes. */
export function attendre(millisecondes) {
  return new Promise((resoudre) => {
    setTimeout(resoudre, millisecondes);
  });
}

/** Borne une valeur entre un minimum et un maximum. */
export function limiter(valeur, minimum, maximum) {
  return Math.min(Math.max(valeur, minimum), maximum);
}

/** Vrai si la personne a demandé à réduire les animations dans son système. */
export function mouvementReduit() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Écrit un message dans la zone réservée aux lecteurs d'écran.
 * Rien n'apparaît visuellement : c'est uniquement pour l'accessibilité.
 */
export function annoncer(message) {
  const zone = document.getElementById('annonces');
  if (!zone) return;

  // On vide d'abord : certains lecteurs d'écran ignorent un texte identique
  zone.textContent = '';
  window.setTimeout(() => {
    zone.textContent = message;
  }, 60);
}
