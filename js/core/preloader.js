/**
 * Préchargement de départ.
 *
 * Rien de lourd n'est chargé ici : l'acte 1 n'a aucun média. On attend surtout
 * les polices, avec un plafond de sécurité, pour éviter que l'expérience
 * démarre avec une typographie qui change sous les yeux.
 *
 * Les médias des actes suivants seront préchargés acte par acte, pas ici.
 */

import { CONFIG } from './config.js';
import { DECORS } from './assets.js';
import { attendre } from './utils.js';

export async function precharger() {
  const racine = document.documentElement;
  const bloc = document.getElementById('prechargement');
  const jauge = document.getElementById('prechargement-jauge');

  racine.dataset.etat = 'chargement';
  if (!bloc) return;

  // Les polices locales arrivent avec le CSS. On les attend, mais jamais
  // au-delà du délai maximum : un média lent ne doit pas bloquer l'entrée.
  const polices = document.fonts ? document.fonts.ready : Promise.resolve();

  // Le fond nébuleux est le premier décor vu : on le décode pendant le seuil.
  // Il ne bloque jamais l'entrée plus de 3 s, même sur une connexion lente.
  const fond = new Image();
  fond.src = DECORS.nebuleuse.fichier;
  const fondPret = fond.decode ? fond.decode().catch(() => {}) : Promise.resolve();
  const attenteFond = Promise.race([fondPret, attendre(3000)]);

  await Promise.race([
    Promise.all([polices, attenteFond]),
    attendre(CONFIG.prechargement.delaiMaximum),
  ]);

  // Durée minimale d'affichage : évite un clignotement si tout est en cache
  await attendre(CONFIG.prechargement.delaiMinimum);

  if (jauge) jauge.value = jauge.max;
  await attendre(200);

  bloc.classList.add('est-termine');
  await attendre(520);
  bloc.hidden = true;

  racine.dataset.etat = 'pret';
}
