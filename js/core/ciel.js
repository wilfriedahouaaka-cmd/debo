/**
 * Ciel de poussière.
 *
 * Dix-huit points placés au hasard, animés uniquement en CSS.
 * Aucun canvas, aucune boucle d'animation : le téléphone respire.
 *
 * Le fond nébuleux est lui aussi purement décoratif : on transmet son chemin
 * à la feuille de style, qui gère le cadrage et le voile de lisibilité.
 */

import { DECORS } from './assets.js';

const NOMBRE = 18;

export function semerCiel() {
  const ciel = document.getElementById('ciel');
  if (!ciel) return;

  // Le CSS ne connaît aucun chemin de fichier : il reçoit celui d'assets.js.
  // Une URL absolue est nécessaire : une URL relative serait résolue depuis
  // la feuille de style (css/layout/), pas depuis la page.
  const adresse = new URL(DECORS.nebuleuse.fichier, document.baseURI).href;
  ciel.style.setProperty('--fond-nebuleuse', `url("${adresse}")`);

  if (ciel.childElementCount > 0) return;

  for (let index = 0; index < NOMBRE; index += 1) {
    const point = document.createElement('i');

    point.style.left = `${(Math.random() * 100).toFixed(2)}%`;
    point.style.top = `${(Math.random() * 100).toFixed(2)}%`;
    point.style.setProperty('--taille', `${(Math.random() * 1.6 + 1).toFixed(1)}px`);
    point.style.setProperty('--duree', `${(Math.random() * 5 + 4).toFixed(1)}s`);
    point.style.setProperty('--retard', `${(Math.random() * -8).toFixed(1)}s`);

    ciel.append(point);
  }
}
