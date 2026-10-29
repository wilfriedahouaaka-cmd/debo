/**
 * Acte 2 — La Première Image
 *
 * Une photo d'elle, floue. En descendant, une seconde version nette la
 * recouvre depuis la droite, comme une fréquence qu'on règle.
 * La musique naît en même temps : son volume suit la netteté.
 *
 * Aucun média supplémentaire : c'est la même photo, deux fois.
 */

import { mouvementReduit, annoncer } from '../core/utils.js';
import { mediasDeActe } from '../core/assets.js';
import { CONFIG } from '../core/config.js';
import { jouer, definirVolume } from '../core/audio-manager.js';
import { jouerInterlude, arreterInterlude } from '../ui/interlude.js';

export const titre = 'La Première Image';

let racine = null;
let defilement = null;
let cadre = null;
let nette = null;
let ligne = null;
let indice = null;
let bouton = null;
let audioDemarre = false;
let minuteurSecours = null;
let demande = null;
let session = 0;

const STRUCTURE = (source) => `
  <div class="image">
    <div class="image__defilement" tabindex="0" role="region" aria-label="Photo de Déborah — fais défiler pour la révéler">
      <div class="image__piste">
        <div class="image__scene">
          <div class="image__cadre">
            <img class="image__photo image__photo--floue" src="${source}" alt="" aria-hidden="true">
            <img class="image__photo image__photo--nette" src="${source}" alt="Déborah">

            <span class="image__ligne" aria-hidden="true">
              <span class="image__poignee"></span>
            </span>

            <div class="image__textes">
              <p class="image__titre">Je t'ai trouvée.</p>
              <p class="image__suite">Et depuis, tout a pris une autre couleur.</p>
            </div>
          </div>

          <p class="image__indice" aria-hidden="true">Défiler</p>

          <div class="image__pied">
            <button class="bouton-suite" type="button" disabled>
              Passer à la suite <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export function init(conteneur) {
  const { photos } = mediasDeActe(2);
  const photo = photos[0];
  if (!photo) {
    throw new Error('Acte 2 : aucune photo disponible dans assets.js');
  }

  conteneur.classList.add('acte--image');
  conteneur.innerHTML = STRUCTURE(photo.fichier);

  racine = conteneur;
  defilement = conteneur.querySelector('.image__defilement');
  cadre = conteneur.querySelector('.image__cadre');
  nette = conteneur.querySelector('.image__photo--nette');
  ligne = conteneur.querySelector('.image__ligne');
  indice = conteneur.querySelector('.image__indice');
  bouton = conteneur.querySelector('.bouton-suite');

  defilement.addEventListener('scroll', surDefilement, { passive: true });
  bouton.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('acte:suivant'));
  });
}

export function enter() {
  const reduit = mouvementReduit();
  const jeton = ++session;

  audioDemarre = false;
  defilement.scrollTop = 0;
  activerBouton(false);
  indice.classList.remove('est-parti');
  racine.classList.remove('est-texte', 'est-suite');

  if (reduit) {
    // Mouvement réduit : pas de flou piloté par le scroll, tout est net.
    appliquer(1);
  } else {
    appliquer(0);
  }

  // L'intermède noir couvre l'acte le temps des deux messages. L'acte 2 est
  // déjà prêt derrière : son fondu de sortie le révèle sans coupure.
  jouerInterlude().then(() => {
    if (jeton !== session) return;

    if (reduit) {
      montrerTextes();
      activerBouton(true);
      demarrerAudio(CONFIG.audio.volume);
      return;
    }

    // Le filet de sécurité ne démarre qu'une fois l'intermède terminé :
    // sinon il révélerait l'image derrière l'écran noir.
    minuteurSecours = setTimeout(() => {
      montrerTextes();
      activerBouton(true);
      demarrerAudio(CONFIG.audio.volume * 0.6);
    }, 15000);
  });
}

export function exit() {
  session += 1;
  arreterInterlude();

  if (minuteurSecours) clearTimeout(minuteurSecours);
  minuteurSecours = null;
  if (demande) cancelAnimationFrame(demande);
  demande = null;
}

/* -------------------------------------------------------------------------- */

function surDefilement() {
  if (demande) return;

  demande = requestAnimationFrame(() => {
    demande = null;

    const hauteurUtile = defilement.scrollHeight - defilement.clientHeight;
    const brut = hauteurUtile > 0 ? defilement.scrollTop / hauteurUtile : 1;

    appliquer(brut);

    if (brut > 0.02) {
      indice.classList.add('est-parti');
    }

    if (brut > 0.05 && !audioDemarre) {
      demarrerAudio(0);
    }

    if (audioDemarre) {
      definirVolume(brut * CONFIG.audio.volume);
    }

    if (brut >= 0.6) montrerTextes();
    if (brut >= 0.98) activerBouton(true);
  });
}

/**
 * Une seule valeur pilote tout : la découpe de l'image nette,
 * la position du filet et le volume du son.
 */
function appliquer(valeur) {
  const progression = Math.min(Math.max(valeur, 0), 1);

  // L'image nette apparaît depuis la droite : sa partie gauche est masquée
  nette.style.clipPath = `inset(0 0 0 ${(1 - progression) * 100}%)`;

  // Le filet parcourt le cadre de droite à gauche, quelle que soit sa taille.
  // Sur mobile le cadre occupe l'écran ; sur ordinateur, la carte centrée.
  const largeur = cadre.clientWidth || 1;
  ligne.style.transform = `translate3d(-${progression * largeur}px, 0, 0)`;
}

function montrerTextes() {
  if (racine.classList.contains('est-texte')) return;

  racine.classList.add('est-texte');
  annoncer("Je t'ai trouvée.");

  setTimeout(() => {
    racine.classList.add('est-suite');
  }, 1200);
}

function activerBouton(actif) {
  bouton.disabled = !actif;
  bouton.classList.toggle('est-pret', actif);

  if (actif) {
    if (minuteurSecours) clearTimeout(minuteurSecours);
    minuteurSecours = null;
  }
}

function demarrerAudio(volume) {
  if (audioDemarre) return;
  audioDemarre = true;
  jouer();
  definirVolume(volume);
}
