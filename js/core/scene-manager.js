/**
 * Chef d'orchestre des sept actes.
 *
 * Règles :
 * - un seul acte actif à la fois ;
 * - les actes ne se connaissent pas entre eux ;
 * - ils demandent le suivant en émettant l'événement « acte:suivant ».
 *
 * Contrat d'un acte : { titre, init(conteneur), enter(), exit() }.
 */

import { CONFIG } from './config.js';
import { attendre, mouvementReduit, annoncer } from './utils.js';

const actes = new Map();
let hote = null;
let courant = null;
let enTransition = false;

/** Déclare un acte. Appelé par main.js, jamais par un acte voisin. */
export function enregistrer(numero, module) {
  actes.set(numero, module);
}

export function initialiserScene() {
  hote = document.getElementById('scene');
  if (!hote) {
    throw new Error('Conteneur #scene introuvable dans index.html');
  }

  document.addEventListener('acte:suivant', () => {
    if (!courant) return;

    const suivant = courant.numero + 1;
    if (!actes.has(suivant)) {
      // Tant que l'acte suivant n'existe pas, on reste sur place :
      // jamais d'écran noir qui donnerait l'impression d'un bug.
      console.warn(`[fréquences] Acte ${suivant} non enregistré : l'expérience s'arrête ici.`);
      return;
    }

    allerA(suivant);
  });
}

export async function allerA(numero) {
  if (enTransition) return;
  if (courant && courant.numero === numero) return;

  const module = actes.get(numero);
  if (!module) {
    console.warn(`[fréquences] Acte ${numero} inconnu.`);
    return;
  }

  enTransition = true;
  const duree = mouvementReduit() ? 0 : CONFIG.transitions.dureeScene;

  // 1. Sortie de l'acte courant
  if (courant) {
    courant.element.classList.remove('est-actif');
    if (typeof courant.module.exit === 'function') courant.module.exit();

    await attendre(duree);
    courant.element.hidden = true;
    courant = null;
  }

  // 2. L'acte existe déjà dans le DOM ? On le réutilise. Sinon on le construit.
  let element = hote.querySelector(`[data-acte="${numero}"]`);
  if (!element) {
    element = document.createElement('section');
    element.className = 'acte';
    element.dataset.acte = String(numero);
    element.setAttribute('aria-label', module.titre || `Acte ${numero}`);
    hote.append(element);

    if (typeof module.init === 'function') module.init(element);
  }

  element.hidden = false;

  // Laisse le navigateur peindre l'élément avant de lancer la transition
  await attendre(20);
  element.classList.add('est-actif');

  if (typeof module.enter === 'function') module.enter();

  courant = { numero, module, element };
  document.documentElement.dataset.acte = String(numero);
  document.dispatchEvent(
    new CustomEvent('acte:change', {
      detail: { numero, titre: module.titre || `Acte ${numero}` },
    })
  );
  annoncer(`Acte ${numero} sur ${CONFIG.actes.total}`);

  enTransition = false;
}
