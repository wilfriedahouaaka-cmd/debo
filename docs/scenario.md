# Les Fréquences Cachées

**Pour :** Déborah
**Créé par :** Wilfried
**Format :** expérience web immersive, une seule page, sept actes
**Durée estimée :** 9 à 11 minutes
**Promesse :** lui faire traverser, dans l'ordre, ce qu'elle est : un signal qu'on capte, une image qu'on reconnaît, un univers qu'on découvre, une intensité qu'on traverse, un lien qui se forme, un silence, et une gratitude.

> Document de référence du projet. Toute décision de mise en scène, de texte ou de timing se prend ici, pas dans le code.
> Les blocs marqués **Proposition** sont des ajouts soumis à validation. Tout le reste vient du scénario de Wilfried.

---

## 1. Le fil rouge

Un signal instable arrive. On le stabilise d'un clic. Il révèle une image. Cette image ouvre un univers. L'univers devient une intensité. L'intensité devient un nom. Le nom laisse place au silence. Le silence laisse place à la gratitude.

Sept actes, sept lettres : **D.É.B.O.R.A.H.** Le prénom contient exactement sept lettres. Ce n'est pas exploité visuellement avant l'acte 5, mais c'est le squelette secret du découpage.

**Règle de rythme, valable partout :** aucune révélation ne se produit dans la foulée d'une autre. Chaque moment fort est précédé d'un temps mort. L'émotion naît du silence qui précède, pas de l'animation qui suit.

---

## 2. Les cinq règles de mise en scène

1. **Une seule chose à la fois.** Un acte ne demande jamais deux gestes. On clique, puis on regarde. On descend, puis on lit.
2. **Le texte ne précède jamais l'image.** L'image arrive, on la laisse respirer, le texte se pose ensuite.
3. **Aucune animation décorative.** Chaque mouvement raconte quelque chose : le signal se cale, l'image se précise, les fragments arrivent, les lettres se heurtent.
4. **Le son est un personnage.** Il apparaît à l'acte 2, monte avec la netteté, culmine à l'acte 4, s'éteint à l'acte 6, revient à peine à l'acte 7.
5. **Le vide est un matériau.** Un écran presque noir pendant deux secondes n'est pas un bug. C'est le moment où elle comprend qu'il va se passer quelque chose.

---

## 3. Répartition des médias

| Acte | Médias | Scroll |
|---|---|---|
| 1 — Le Signal | Aucun (texte, lumière, son coupé) | Aucun |
| 2 — La Première Image | 1 photo de Déborah | Interne (1 écran et demi) |
| 3 — Les Univers | 15 visuels d'univers | Interne (long) |
| 4 — Le Crescendo | 6 photos + 1 vidéo | Interne (très long) |
| 5 — Le Lien | Aucun (lettres, particules) | Aucun |
| 6 — Le Silence | Aucun (noir) | Aucun |
| 7 — La Fin | Aucun (texte, pulsations) | Aucun |

**Photos :** `a.jpeg`, `b.jpeg`, `c.jpeg`, `e.jpeg`, `v.jpeg`, `w.jpeg`, `x.jpeg`
**Vidéo :** `cs.mp4`
**Musique :** `Drake - Hotline Bling(MP3_160K).mp3`
**Univers :** `assets/univers/` — les 15 visuels sont réunis.

---

## 4. Acte 1 — Le Signal

**Durée cible :** 12 à 20 secondes
**Scroll :** aucun
**Son :** silence total

### Intention

Elle ouvre le lien sans savoir ce que c'est. L'écran est presque noir. Quelque chose cloche, légèrement. Une fréquence cherche à se caler. Elle clique. Tout s'arrête de trembler.

### Déroulé

1. **0 s — 2 s.** Écran noir. Rien. Puis une ligne de texte apparaît en fondu très lent, à peine lisible : un relevé de fréquence qui dérive (`87.4 … 91.2 … 96.8 …`). Les chiffres bougent par à-coups, jamais en continu.
2. **2 s — 8 s.** Le cadre tremble très légèrement, par micro-décalages de 1 à 2 pixels, avec des pauses irrégulières. Aucun parasite, aucune neige, aucune distorsion lourde. Trois ou quatre fragments de mots apparaissent puis s'effacent (`— tu captes ?`, `— reste`, `— ne raccroche pas`).
3. **8 s — …** Un seul élément cliquable : la fréquence elle-même, devenue un bouton discret. Curseur main, contour net, aucune flèche, aucun « Commencer ».
4. **Au clic.** Le tremblement s'arrête d'un coup. Les chiffres se figent sur une valeur stable. Un silence d'une seconde. Puis le message s'écrit.

### Texte exact

> Bonne arrivée.

**Proposition —** après « Bonne arrivée. », une seconde ligne apparaît 900 ms plus tard, plus petite, en gris : **« Reste un peu. »**
Effet : on passe d'une salutation polie à une invitation. C'est le premier moment où elle comprend que ce n'est pas un site, c'est pour elle.

### Technique

- Le clic déverrouille l'audio du navigateur. C'est le seul geste autorisé à le faire, et il doit rester le premier. Sans ce clic, aucune musique ne pourra démarrer à l'acte 2.
- Le tremblement se fait en `transform: translate3d()` sur un conteneur, jamais en modifiant des marges.
- La fréquence est un texte réel, pas une image : elle reste lisible, sélectionnable et accessible.
- **Piège :** un clic qui ne fait « que » stabiliser l'écran peut sembler vide. Le changement doit être perceptible en moins de 200 ms, sinon elle reclique.

---

## 5. Acte 2 — La Première Image

**Durée cible :** 35 à 50 secondes
**Scroll :** interne, environ 1,5 écran
**Son :** la musique naît ici

### Intention

La première fois qu'elle se voit dans l'expérience. Le flou n'est pas un effet : c'est le temps qu'il faut pour la reconnaître.

### Déroulé

1. L'acte s'ouvre sur une photo **floue**, légèrement décalée sur la gauche, jamais centrée.
2. Une indication de scroll très discrète apparaît en bas, puis s'efface dès le premier geste.
3. En descendant, le flou diminue par paliers continus. La photo remonte de 24 px maximum (parallaxe légère).
4. **Le volume de la musique suit la netteté.** À 0 % de netteté : muet. À 100 % : volume normal. La courbe est adoucie pour ne pas donner l'impression d'un curseur.
5. À 60 % de netteté, le texte apparaît.
6. À 100 %, la photo est parfaitement nette, le bouton apparaît.

### Texte exact

> Je t'ai trouvée.

**Proposition —** le texte arrive **après** 60 % de netteté, pas avant. Et il apparaît lettre à lettre, très lentement (une lettre toutes les 80 ms), comme s'il était écrit à la main. Le point final reste seul 1,2 seconde avant que le bouton n'apparaisse.

### Technique

- La netteté est pilotée par la progression du scroll dans l'acte, pas par un minuteur.
- Le flou : `filter: blur()` de 18 px à 0. Sur mobile bas de gamme, le flou coûte cher : limiter la zone floutée à l'image, jamais à l'écran entier.
- **Piège mobile :** un scroll interne dans un écran de 100vh peut enfermer. Prévoir une sortie : le bouton reste atteignable même si elle ne descend pas jusqu'en bas, et le scroll ne doit jamais déclencher un changement d'acte par accident.
- La musique ne démarre **jamais** avant le premier mouvement de scroll. Si elle ne bouge pas, elle reste dans le silence : c'est voulu.

---

## 6. Acte 3 — Les Univers

**Durée cible :** 2 à 3 minutes
**Scroll :** interne, long
**Son :** musique continue, légèrement en retrait

### Intention

Elle n'entre pas dans un catalogue. Elle entre dans une pièce où ses affaires sont éparpillées au sol, et où chaque objet lui rappelle quelque chose.

### Principe

- Les fragments apparaissent progressivement au scroll, jamais tous d'un coup.
- Aucun classement par catégorie. L'ordre alterne les univers pour créer du rythme.
- Chaque fragment porte : un visuel, une description courte, un message personnel.
- Chaque univers garde sa couleur, mais **discrètement** : un filet, un point, une lueur sur le bord. Jamais une carte entièrement colorée.

**Proposition —** hiérarchie typographique stricte dans chaque fragment :
- la **description** en petites capitales, gris, très discrète ;
- le **message personnel** en serif, taille supérieure, blanc cassé, interligne large.
C'est le message personnel qui doit dominer. La description n'est qu'un repère.

**Proposition —** varier la forme. Trois formats alternés au hasard maîtrisé : fragment pleine largeur, fragment décalé à droite, fragment en vignette. Deux fragments consécutifs ne doivent jamais avoir la même forme, sinon l'effet catalogue revient.

**Proposition —** une numérotation minuscule (`03 / 15`) en bas de chaque fragment. Elle donne le sentiment d'avancer dans quelque chose de fini, et rappelle le relevé de fréquence de l'acte 1.

### Couleurs

| Univers | Couleur | Token à créer |
|---|---|---|
| Animés | rose poudré | `--c-rose` — proposition `#d08c9d` |
| Musique | or laiton | `--c-accent` — déjà défini `#c9a86a` |
| Séries | violet clair | `--c-violet-clair` — proposition `#8e6fa8` |

Ces trois couleurs reviennent à l'acte 5. Elles ne doivent jamais être utilisées ailleurs.

### Les 15 fragments, dans l'ordre

| # | Fragment | Univers | Description courte | Message personnel |
|---|---|---|---|---|
| 1 | Drake | Musique | Rap et R&B | « Pour les nuits où tu as besoin de te sentir invincible. » |
| 2 | Hunter × Hunter | Animé | Anime d'aventure | « Comme Gon, tu continues même quand ça fait mal. » |
| 3 | Bridgerton | Série | Romance en costumes | « L'élégance, le désir, et les non-dits. » |
| 4 | Katy Perry | Musique | Pop | « Pour les moments où tu décides de briller plus fort. » |
| 5 | Naruto | Animé | Anime de ninjas | « Tu transformes la solitude en puissance. » |
| 6 | Love 101 | Série | Romance et apprentissage | « L'apprentissage du cœur, sans filtre. » |
| 7 | Martina Stoessel | Musique | Chanteuse et actrice | « Pour l'énergie qui ne s'excuse jamais d'exister. » |
| 8 | Kuroko's Basket | Animé | Anime de basket | « Comme Kuroko, ta présence change tout sans forcément crier. » |
| 9 | Mehek | Série | Série pakistanaise | « L'intensité et les émotions à fleur de peau. » |
| 10 | FR2D | Musique | Artiste (à préciser) | « Pour les fréquences plus intimistes et sincères. » |
| 11 | South Park | Animé | Série d'animation satirique | « Même dans le chaos, tu gardes ton humour et ta lucidité. » |
| 12 | À tous les garçons que j'ai aimés | Série | Romance et lettres d'amour | « Les lettres qu'on n'envoie pas… et celles qu'on finit par écrire. » |
| 13 | David Okit | Musique | Chanteur | « Pour la profondeur et le groove qui restent. » |
| 14 | Ma vie avec les Walter Boys | Série | Une grande famille, un été | « Les liens qui se tissent malgré soi. » |
| 15 | Les changements du destin | Série | Série (à préciser) | « Quand la vie décide de tout réécrire. » |

> **À vérifier par Wilfried :** les descriptions de Mehek, FR2D et Les changements du destin. Le scénario initial les laissait « à préciser » ; j'ai mis la mention la plus probable, à corriger si besoin.

### Technique

- Apparition des fragments via `IntersectionObserver`, seuil de 15 à 25 %, une seule fois par fragment. Pas d'animation qui se rejoue quand elle remonte.
- 15 visuels, c'est lourd. Chaque vignette est chargée à la demande, en 800 px de large maximum, et jamais avant d'être à un écran de l'affichage.
- **Piège :** si les 15 images arrivent en même temps, l'acte 3 devient un temps de chargement au lieu d'un moment. Le préchargement doit être progressif, acte par acte.

---

## 7. Acte 4 — Le Crescendo

**Durée cible :** 3 à 4 minutes
**Scroll :** interne, très long
**Son :** volume maximal, la musique porte tout l'acte
**Médias :** 6 photos + 1 vidéo

### Intention

Le cœur de l'expérience. Le moment où l'univers devient personnel, où les références laissent place à sa vie.

### Déroulé

1. **Le lien.** Des points lumineux apparaissent un par un et se relient par des traits fins. La constellation se construit lentement, sur environ 4 secondes.
2. **L'explosion.** Les points se rassemblent au centre puis éclatent en particules. Les particules retombent et s'éteignent, laissant place au silence visuel.
3. **La première photo.** Floue, elle devient nette au scroll, exactement comme à l'acte 2 — mais cette fois le geste est déjà connu d'elle. C'est un rappel, pas une répétition.
4. **Les cinq autres photos et la vidéo.** Elles apparaissent une par une, dispersées, avec beaucoup d'espace entre elles. Chaque apparition est séparée d'au moins un demi-écran de vide.
5. **La vidéo.** Pleine largeur, elle occupe un écran entier. Le son de la vidéo prend le dessus, la musique baisse.
6. **La dernière photo.** Après la vidéo, une dernière image, plus petite, plus intime. Le contraste de taille fait tout.
7. **Le bouton.** « Continuer » apparaît en bas, seulement quand tout a été vu.

**Proposition —** un fil doré vertical, très fin, sur le bord gauche, qui se remplit au fur et à mesure du scroll de l'acte. Il donne un repère sans afficher de pourcentage, et rappelle la fréquence de l'acte 1.

**Proposition —** structurer l'acte en trois mouvements plutôt qu'en liste : **le lien** (points), **l'explosion** (particules), **les souvenirs** (photos et vidéo). Elle ressentira trois temps, pas sept éléments.

### Messages à écrire

| Média | Message descriptif | Message personnel |
|---|---|---|
| Photo 1 (floue → nette) | _à écrire_ | _à écrire_ |
| Photo 2 | _à écrire_ | _à écrire_ |
| Photo 3 | _à écrire_ | _à écrire_ |
| Photo 4 | _à écrire_ | _à écrire_ |
| Photo 5 | _à écrire_ | _à écrire_ |
| Photo 6 | _à écrire_ | _à écrire_ |
| Vidéo | _à écrire_ | _à écrire_ |

> **C'est le seul point bloquant du projet.** Sept blocs de deux phrases. Tant qu'ils ne sont pas écrits, l'acte 4 ne peut pas être finalisé, seulement maquetté.

### Technique

- Particules : `canvas` 2D, **150 particules maximum**, densité de pixels plafonnée à 2, animation mise en pause dès que l'acte n'est plus visible.
- **Piège :** une explosion de particules plein écran sur un téléphone d'entrée de gamme fait tomber la fluidité. Mieux vaut 120 particules fluides que 600 saccadées.
- La vidéo se lance **au clic**, avec un bouton de lecture net. Jamais en autoplay avec son : le navigateur le bloque, et un échec silencieux casse la scène.
- Sous-titres ou texte de secours si la vidéo ne charge pas : un cadre propre, jamais une icône cassée.

---

## 8. Acte 5 — Le Lien

**Durée cible :** 45 à 70 secondes
**Scroll :** aucun
**Son :** la musique se stabilise puis se retire

### Intention

Le chaos de tout ce qu'elle aime, de tout ce qu'elle est, qui finit par tenir debout. Le moment où les trois couleurs deviennent un seul mot.

### Déroulé

1. Les trois fréquences — rose, or, violet — convergent depuis trois directions.
2. Elles se percutent, se traversent, se mélangent. Le chaos est **vivant mais contenu** : pas d'aléatoire total, trois phases seulement.
3. Les sept lettres de « Déborah » arrivent, chacune portant une couleur. Elles se croisent, se heurtent, repartent.
4. Progressivement, elles ralentissent et se placent, dans l'ordre, en grand.
5. Le prénom est formé. **Silence visuel de 1,5 seconde.** Rien ne bouge.
6. Le message s'écrit à la machine à écrire.

**Proposition —** quand les lettres se posent, elles abandonnent leur couleur et deviennent blanc cassé. Les trois fréquences disparaissent à cet instant. C'est la traduction visuelle de l'idée : elle n'est pas la somme de ses goûts, elle est quelqu'un.

### Texte exact

> Il y a des gens qui entrent dans ta vie comme une chanson. D'autres comme un combat. Et il y en a qui arrivent comme une série que tu ne savais pas que tu attendais.

### Technique

- Les sept lettres sont du texte réel, pas une image. Chaque lettre est un élément animé indépendamment, mais l'ensemble reste lisible par un lecteur d'écran comme un seul mot.
- Animation déterministe : les trajectoires sont définies, pas tirées au hasard. C'est plus beau, plus rapide, et reproductible.
- Machine à écrire : 28 à 35 ms par caractère, avec une pause de 600 ms avant de commencer.
- **Piège :** sous `prefers-reduced-motion`, le chaos est remplacé par un simple fondu du prénom. On ne supprime pas le texte, on supprime le mouvement.

---

## 9. Acte 6 — Le Silence

**Durée cible :** 20 à 35 secondes
**Scroll :** aucun
**Son :** coupure

### Intention

Le moment le plus fort de l'expérience, et le plus simple. Tout s'arrête. Elle reste seule avec une phrase.

### Déroulé

1. L'écran devient noir en 600 ms.
2. **La musique s'éteint en 400 ms.** Pas un fondu long : une coupure nette mais pas brutale. Le silence doit s'entendre.
3. Deux secondes de noir absolu, sans texte, sans mouvement.
4. La phrase apparaît en fondu très lent, 2 secondes.
5. Elle reste à l'écran 4 secondes.
6. Un discret « continuer » apparaît en bas, sans clignotement, sans flèche animée.

**Proposition —** ne jamais faire avancer cet acte automatiquement. C'est elle qui décide de quitter le silence. Un acte qui s'enchaîne tout seul à cet endroit détruit l'effet.

### Texte exact

> Merci d'exister.

### Technique

- Aucune animation autre que l'opacité. Pas de particules, pas de grain, pas de vignettage.
- Le noir doit être le même que le fond général (`--c-bg`), sinon on voit une couture.

---

## 10. Acte 7 — La Fin

**Durée cible :** 60 à 90 secondes
**Scroll :** aucun
**Son :** retour très discret, puis extinction

### Intention

Redescendre. Pas un feu d'artifice final : une main posée sur l'épaule.

### Déroulé

1. L'écran se rallume à peine, dans un gris très sombre.
2. Trois pulsations lentes, comme un battement de cœur : 0 s, 0,9 s, 1,8 s.
3. Le texte s'écrit à la machine à écrire, lentement.
4. À la fin du texte, la signature apparaît seule.
5. Le bouton final apparaît 1,5 seconde après.
6. La musique s'éteint complètement.

**Proposition —** si l'appareil le permet, faire vibrer très légèrement le téléphone sur les trois pulsations. Sur iPhone, ce n'est pas possible sans application native : la vibration reste un bonus Android, jamais une condition.

### Texte exact

> Déborah,
>
> Je voulais te faire ressentir un peu de tout ce que tu représentes. Pas juste avec des mots, mais avec ce que tu aimes, ce qui te ressemble, et ce qui me rappelle pourquoi tu comptes.
>
> Merci d'être entrée dans ma vie. Merci d'exister exactement comme tu es.
>
> — Wilfried

### Bouton final

> Me dire ce que tu as ressenti

Lien : `https://wa.me/2250143928168`
Conversation vide, **aucun message pré-écrit**. Ouverture dans un nouvel onglet.

**Proposition —** le bouton n'apparaît qu'après la fin du texte. Un bouton présent trop tôt invite à sortir avant d'avoir lu.

---

## 11. Direction artistique

| Élément | Choix |
|---|---|
| Fond | nuit prune presque noire `#0a0709` |
| Accent | or laiton `#c9a86a`, réservé aux moments qui comptent |
| Matière | violet profond `#2a1b33` et `#4a2f5c` |
| Univers | rose `#d08c9d` (animés), or (musique), violet clair `#8e6fa8` (séries) |
| Titres | Cormorant Garamond, serif à fort contraste |
| Texte | Karla, sans humaniste |
| Arêtes | franches ; le seul cercle est la commande de lecture |
| Mouvement | lent, rare, déclenché par un geste |

**Interdits :** dégradé violet-bleu, halos flous, cartes arrondies partout, emojis en guise d'icônes, animations qui tournent en boucle sans raison.

---

## 12. Technique — arbitrage à trancher

Le scénario initial demande **GSAP + ScrollTrigger + TextPlugin + Lenis**. La contrainte donnée au départ est **HTML + CSS + JavaScript vanilla, sans framework ni dépendance**.

C'est une contradiction réelle. Trois options :

### Option A — 100 % vanilla (recommandée)

| Besoin | Remplacement |
|---|---|
| Flou → net au scroll | progression calculée en JS sur le conteneur de l'acte, une seule boucle `requestAnimationFrame` |
| Apparition des fragments | `IntersectionObserver` |
| Machine à écrire | fonction maison, 20 lignes, avec contournement `prefers-reduced-motion` |
| Particules | `canvas` 2D, 120 à 150 particules |
| Transitions d'actes | transitions et animations CSS |
| Smooth scroll | natif, avec `scroll-behavior` et `overscroll-behavior` |

**Pour :** zéro dépendance, zéro build, environ 8 Ko de code au lieu de 80 à 120 Ko de bibliothèques, contrôle total, maintenance simple.
**Contre :** il faut écrire soi-même ce que GSAP offre gratuitement (pinning, scrub complexe). Ici, aucun besoin ne l'exige.

### Option B — GSAP local, sans build

GSAP est gratuit depuis 2025, usage commercial inclus. On copie les fichiers dans `js/vendor/`, aucun CDN.
**Pour :** développement plus rapide sur les séquences complexes.
**Contre :** ~70 Ko compressés, une dépendance à maintenir, et le risque de tout écrire « à la GSAP » alors que 80 % des effets sont réalisables en CSS.

### Option C — vanilla + Lenis uniquement

**Contre :** Lenis détourne le scroll natif. Sur mobile, et particulièrement sur un téléphone d'entrée de gamme à Abidjan, c'est le meilleur moyen d'obtenir un scroll qui traîne, qui saute, ou qui bloque le pinch. **Je le déconseille fermement.**

### Recommandation

**Option A.** Aucun effet demandé dans ce scénario ne justifie une bibliothèque. Le vrai risque de ce projet n'est pas la puissance d'animation : c'est le poids sur une connexion mobile et la fluidité sur un appareil modeste. Chaque kilo-octet économisé est un dixième de seconde d'émotion gagné.

> Décision à prendre par Wilfried avant l'acte 1.

---

## 13. Performance mobile

C'est une contrainte de conception, pas une finition.

| Élément | Budget |
|---|---|
| Acte 1 (premier écran) | < 100 Ko, tout compris |
| Photo de l'acte 2 | < 250 Ko, 1600 px de large maximum |
| Visuel d'univers | < 90 Ko, 800 px de large |
| Photo de l'acte 4 | < 250 Ko, 1600 px de large |
| Vidéo | < 8 Mo, 720p, H.264 + WebM, avec image de couverture |
| Total au premier chargement | < 500 Ko |

Règles :
- Préchargement **par acte**, jamais global. On ne télécharge pas l'acte 4 pendant qu'elle lit l'acte 2.
- Images en WebP ou AVIF, avec dimensions réelles déclarées.
- `loading="lazy"` sous la ligne de flottaison.
- Aucune police chargée avant l'acte 2, et seulement deux graisses par famille.
- Aucun appel réseau externe : tout est local.

---

## 14. Accessibilité

- Navigation clavier complète : chaque bouton atteignable à `Tab`, focus visible en or.
- `prefers-reduced-motion` respecté partout : le flou se règle sans animation, le chaos des lettres devient un fondu, les particules deviennent une constellation statique.
- Machine à écrire : le texte complet est disponible immédiatement pour les lecteurs d'écran, même s'il s'écrit visuellement.
- Contraste minimum 4,5:1 pour le texte courant.
- Cibles tactiles de 44 × 44 px minimum.
- **Contrôle du son obligatoire** : un bouton muet discret, accessible en permanence. Elle peut ouvrir le lien dans un lieu public, ou la nuit. Ce n'est pas une option.
- Aucun texte ne doit dépendre uniquement de la couleur pour être compris.

---

## 15. Ce qui manque pour construire

### Bloquant

1. **Les 15 visuels de l'acte 3.** Tous réunis dans `assets/univers/`.
2. **Les 7 messages de l'acte 4** (6 photos + 1 vidéo), deux phrases chacun.
3. **L'arbitrage technique** : vanilla ou GSAP.

### Important

4. **La photo de l'acte 2** : laquelle des sept ? C'est la première image qu'elle verra d'elle-même.
5. **L'ordre des six photos de l'acte 4** : lequel raconte quoi ?
6. **Le titre de la vidéo** et son contenu exact.
7. **Les droits des visuels d'univers** : affiches et pochettes sont protégées. Pour un cadeau privé non indexé, le risque est faible. Pour un partage large, il faudra des visuels libres.

### À vérifier

8. **Mehek**, **FR2D**, **Les changements du destin** : descriptions à confirmer.
9. **La prononciation du prénom** dans les textes : « Déborah » avec accent, partout, sans exception.

---

## 16. Plan de fabrication

| Étape | Contenu | Dépend de |
|---|---|---|
| 1 | Acte 1 complet, testé sur téléphone | rien |
| 2 | Acte 2 avec une photo provisoire | la photo choisie |
| 3 | Acte 5 (le nom et le texte) | rien |
| 4 | Acte 6 et 7 (textes définitifs déjà écrits) | rien |
| 5 | Acte 3, une fois les 15 visuels reçus | les visuels |
| 6 | Acte 4, une fois les messages écrits | les 7 messages |
| 7 | Passe finale : mobile 360 px, connexion lente, clavier, animations réduites | tout |

L'ordre n'est pas chronologique par hasard : on construit d'abord ce qui est certain, on garde pour la fin ce qui dépend de contenus qui n'existent pas encore. Ainsi, l'expérience est présentable à tout moment, même incomplète.
