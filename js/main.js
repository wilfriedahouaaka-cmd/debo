/**
 * Point d'entrée de « Les Fréquences Cachées ».
 *
 * Déroulé : préchargement → acte 01 (le signal).
 * Les actes suivants s'enregistrent ici, un par un, au fur et à mesure
 * de leur écriture. Aucun acte n'importe un autre acte.
 */

import { CONFIG } from './core/config.js';
import { initialiserScene, enregistrer, allerA } from './core/scene-manager.js';
import { precharger } from './core/preloader.js';
import { initialiserEntete } from './core/entete.js';
import { semerCiel } from './core/ciel.js';
import * as acte01 from './actes/acte-01.js';
import * as acte02 from './actes/acte-02.js';
import * as acte03 from './actes/acte-03.js';
import * as acte04 from './actes/acte-04.js';
import * as acte05 from './actes/acte-05.js';
import * as acte06 from './actes/acte-06.js';
import * as acte07 from './actes/acte-07.js';

const racine = document.documentElement;

/** Trace réservée au mode debug, pour ne rien laisser fuir en production. */
function tracer(...informations) {
  if (!CONFIG.debug) return;
  console.log('%c[fréquences]', 'color:#c9a86a', ...informations);
}

/**
 * Lien de travail : « ?acte=3 » ouvre directement un acte.
 * Utile pour régler un acte sans rejouer les précédents.
 * Ignoré dès que CONFIG.debug passe à false.
 */
function acteDemande() {
  if (!CONFIG.debug) return CONFIG.actes.premier;

  const valeur = new URLSearchParams(window.location.search).get('acte');
  const numero = Number(valeur);

  const valide =
    Number.isInteger(numero) &&
    numero >= CONFIG.actes.premier &&
    numero <= CONFIG.actes.total;

  return valide ? numero : CONFIG.actes.premier;
}

async function initialiser() {
  try {
    tracer(`Démarrage v${CONFIG.version}`);

    initialiserScene();
    initialiserEntete();
    semerCiel();

    // Un acte = un module. On l'enregistre avant de lancer quoi que ce soit.
    enregistrer(1, acte01);
    enregistrer(2, acte02);
    enregistrer(3, acte03);
    enregistrer(4, acte04);
    enregistrer(5, acte05);
    enregistrer(6, acte06);
    enregistrer(7, acte07);

    await precharger();

    const depart = acteDemande();
    if (depart !== CONFIG.actes.premier) {
      tracer(`Ouverture directe sur l'acte ${depart} (mode debug)`);
    }
    await allerA(depart);

    racine.dataset.etat = 'actif';
    document.dispatchEvent(new CustomEvent('experience:lancee'));
  } catch (erreur) {
    // Un échec ne doit jamais laisser une page blanche muette
    racine.dataset.etat = 'erreur';
    console.error('[fréquences] Échec du démarrage :', erreur);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialiser, { once: true });
} else {
  initialiser();
}
