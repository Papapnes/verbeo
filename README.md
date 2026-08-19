# Verbéo

Une application web éducative pour apprendre les verbes anglais réguliers et irréguliers.

## Fonctionnalités

- recherche d'un verbe anglais à l'infinitif ;
- affichage du prétérit et du participe passé ;
- conjugaison au present simple, present perfect, past simple et past perfect avec le sujet « I » ;
- identification des verbes réguliers et irréguliers ;
- traduction et définition en français pour les verbes du dictionnaire local ;
- prononciation de chaque phrase conjuguée avec la synthèse vocale du navigateur ;
- interface responsive pour ordinateur et téléphone.
- modes clair et sombre avec mémorisation du choix ;
- interface disponible en français, anglais et arabe.
- base embarquée de 101 verbes irréguliers vérifiés ;
- lien Cambridge Dictionary affiché avec chaque résultat vérifié ;
- aucune conjugaison inventée pour les verbes absents de la base.

## Utilisation locale

Ouvrez simplement `index.html` dans un navigateur moderne. Aucune installation n'est nécessaire.

## Publication avec GitHub Pages

1. Créez un dépôt GitHub.
2. Ajoutez les fichiers de ce dossier et poussez-les sur la branche `main`.
3. Dans **Settings → Pages**, choisissez **Deploy from a branch**, puis `main` et `/ (root)`.

## Limite actuelle

La conjugaison n'est affichée que pour les verbes présents dans les listes
vérifiées. L'API publique sert à confirmer qu'un mot existe et à fournir une
définition, mais elle n'est jamais utilisée pour inventer un prétérit ou un
participe passé. Les variantes d'usage sont signalées séparément lorsqu'elles
existent.

### Sources de vérification

- Oxford Advanced Learner's Dictionary ;
- Cambridge Dictionary ;
- Merriam-Webster pour les cas ambigus et les variantes.
