/**
 * Machine à écrire partagée.
 *
 * Le texte est ajouté caractère par caractère, avec des respirations après
 * la ponctuation. Le texte complet doit toujours être fourni à côté, dans un
 * élément réservé aux lecteurs d'écran : cette fonction ne s'occupe que du
 * rendu visuel.
 *
 * Sous « prefers-reduced-motion », le texte apparaît d'un coup : on supprime
 * le mouvement, jamais le contenu.
 */

import { mouvementReduit } from './utils.js';

/**
 * Écrit un texte dans un élément.
 *
 * @param {HTMLElement} element - Élément qui reçoit le texte.
 * @param {string} texte - Texte complet, retours à la ligne compris.
 * @param {object} [options]
 * @param {number} [options.vitesse=32] - Durée d'un caractère, en millisecondes.
 * @param {number} [options.delai=0] - Pause avant le premier caractère.
 * @param {AbortSignal|null} [options.signal=null] - Permet d'interrompre
 *   l'écriture quand l'acte quitte la scène.
 * @returns {Promise<void>} Résolue quand le texte est entièrement écrit.
 */
export function ecrire(element, texte, options = {}) {
  const {
    vitesse = 32,
    delai = 0,
    signal = null,
  } = options;

  if (!element) return Promise.resolve();

  // Mouvement réduit : le contenu complet est disponible immédiatement.
  if (mouvementReduit()) {
    element.textContent = texte;
    return Promise.resolve();
  }

  element.textContent = '';

  return new Promise((resoudre) => {
    let index = 0;
    let minuteur = null;
    let terminee = false;

    function terminer() {
      if (terminee) return;
      terminee = true;
      if (minuteur) clearTimeout(minuteur);
      if (signal) signal.removeEventListener('abort', surArret);
      resoudre();
    }

    // Si l'acte est quitté en pleine écriture, on affiche le texte entier :
    // l'élément va disparaître, mais aucun minuteur ne reste derrière lui.
    function surArret() {
      element.textContent = texte;
      terminer();
    }

    function avancer() {
      if (index >= texte.length) {
        terminer();
        return;
      }

      const caractere = texte[index];
      element.textContent += caractere;
      index += 1;

      // Une phrase respire plus longtemps qu'une virgule.
      let multiplicateur = 1;
      if (/[.!?]/.test(caractere)) multiplicateur = 5;
      else if (/[,;:]/.test(caractere)) multiplicateur = 2.5;

      // Un saut de paragraphe marque une vraie pause, sans être une animation.
      const pauseParagraphe = caractere === '\n' ? 220 : 0;

      minuteur = setTimeout(avancer, vitesse * multiplicateur + pauseParagraphe);
    }

    if (signal) signal.addEventListener('abort', surArret, { once: true });

    // Le délai initial sert notamment au silence de 600 ms de l'acte 5.
    minuteur = setTimeout(avancer, delai);
  });
}
