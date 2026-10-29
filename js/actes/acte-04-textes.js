/**
 * Textes de l'acte 4 — Le Crescendo.
 *
 * Version de travail : les descriptions et les messages personnels ont été
 * rédigés à partir des six photos et de la vidéo, sans inventer de date,
 * de lieu ni d'anecdote précise. Wilfried doit corriger ces phrases.
 *
 * Chaque média porte deux textes :
 * - description : repère court, affiché en petites capitales grises ;
 * - personnel   : texte principal, en serif, qui domine la scène.
 *
 * Pour corriger : modifier uniquement les chaînes ci-dessous.
 * L'ordre de lecture est dans ORDRE ; déplacer un identifiant suffit à
 * déplacer le média dans l'acte.
 */

export const TEXTES = Object.freeze({
  b: Object.freeze({
    description: 'Un selfie au t-shirt rose, sur le canapé bordeaux.',
    personnel:
      'Tu n’as pas besoin de sourire pour que la photo existe. Ce regard-là, c’est celui qui me fait poser mon téléphone et te regarder vraiment.',
  }),

  c: Object.freeze({
    description: 'Une photo prise dans l’écran d’un téléphone, avec la mise au point sur ton visage.',
    personnel:
      'Tu passes ton temps à cadrer le monde, à chercher la bonne lumière, à garder une trace. Mais dans cette photo de photo, la seule chose que je vois, c’est toi.',
  }),

  x: Object.freeze({
    description: 'Le même portrait répété quatre fois, en deux rangées.',
    personnel:
      'Quatre fois le même visage, et je n’arrive toujours pas à choisir laquelle regarder. C’est un peu ta façon d’être : tu remplis la pièce sans avoir besoin de faire quoi que ce soit.',
  }),

  e: Object.freeze({
    description: 'Vue d’en bas, deux doigts levés vers l’objectif.',
    personnel:
      'Tu as le don de rendre les moments ordinaires plus légers. Cette photo, c’est toi quand tu décides que la journée ne sera pas grave.',
  }),

  w: Object.freeze({
    description: 'En noir et blanc, les écouteurs aux oreilles et la main sous le menton.',
    personnel:
      'Tu écoutes de la musique comme d’autres respirent : pour tenir debout, pour t’isoler, pour revenir. J’aime te voir comme ça, dans ton monde, sans avoir besoin de te déranger.',
  }),

  cs: Object.freeze({
    titre: 'Treize secondes',
    description: 'Treize secondes devant un mur de briques rouges, à parler avec les mains.',
    personnel:
      'Là, tu ne poses plus : tu vis. J’aime cette vidéo parce qu’elle ne ressemble à aucune autre, et parce qu’elle te ressemble, tout simplement.',
  }),

  v: Object.freeze({
    description: 'Un portrait en noir et blanc, le regard tourné vers autre chose.',
    personnel:
      'Tu n’as pas besoin d’être lumineuse pour être belle ; parfois, c’est quand tu te tais que tu es la plus vraie. Je ne te regarde pas seulement dans tes bons jours.',
  }),
});

/**
 * Ordre de lecture de l'acte 4.
 * Le premier média est la photo floue qui devient nette au scroll.
 * Le dernier média est la photo la plus intime, après la vidéo.
 */
export const ORDRE = Object.freeze(['b', 'c', 'x', 'e', 'w', 'cs', 'v']);
