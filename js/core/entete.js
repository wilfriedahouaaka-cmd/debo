/**
 * En-tête et progression.
 *
 * Affiche l'acte en cours, laisse couper le son, et remplit les sept points.
 * Ne connaît aucun acte : il écoute seulement l'événement « acte:change »
 * émis par le chef d'orchestre.
 */

import { CONFIG } from './config.js';
import { basculerSon, sonActif } from './audio-manager.js';
import { annoncer } from './utils.js';

let numero = null;
let titre = null;
let boutonSon = null;
let libelleSon = null;
const points = [];

export function initialiserEntete() {
  numero = document.getElementById('entete-numero');
  titre = document.getElementById('entete-titre');
  boutonSon = document.getElementById('bouton-son');
  libelleSon = document.getElementById('son-libelle');

  construirePoints();

  if (boutonSon) boutonSon.addEventListener('click', surSon);

  document.addEventListener('acte:change', (evenement) => {
    maj(evenement.detail);
  });

  majSon(sonActif());
}

function construirePoints() {
  const hote = document.getElementById('points');
  if (!hote) return;

  for (let index = 1; index <= CONFIG.actes.total; index += 1) {
    const point = document.createElement('i');
    point.dataset.acte = String(index);
    hote.append(point);
    points.push(point);
  }
}

function maj(detail) {
  const acte = detail?.numero ?? 1;

  if (numero) numero.textContent = `Acte ${acte}`;
  if (titre) titre.textContent = detail?.titre ?? '';

  points.forEach((point, index) => {
    const valeur = index + 1;
    point.classList.toggle('est-actif', valeur === acte);
    point.classList.toggle('est-passe', valeur < acte);
  });
}

function surSon() {
  const actif = basculerSon();
  majSon(actif);
  annoncer(actif ? 'Son rétabli.' : 'Son coupé.');
}

function majSon(actif) {
  if (!boutonSon) return;

  boutonSon.setAttribute('aria-pressed', String(actif));
  boutonSon.setAttribute('aria-label', actif ? 'Couper le son' : 'Rétablir le son');

  if (libelleSon) {
    libelleSon.textContent = actif ? 'Fréquence active' : 'Son coupé';
  }
}
