# Projet P6-Piquante

Construisez une API sécurisée pour une application d'avis gastronomiques

Installation et mise en service du backend :

- après avoir dezzipé le fichier backup.zip, dans le TERMINAL ouvrir le dossier backup

- puis, se mettre dans le dossier backup pour taper :

$ npm install --force

- puis, pour se connecter à une base de donnée mongoDB, prendre le fichier .example.env, mettre les bonnes valeurs ci-dessous :

PORT = 3000 (le front fonctionne bien avec le backend sur le port 3000)

DB_USERNAME="username de la base de donnée mongodb"

DB_PASSWORD="password de la base de donnée mongodb"

DB_CLUSTER = "cluster de la base de donnée mongodb"

JWT_KEY_TOKEN = "XXXXX"

- et enfin, taper :

$ nodemon ou npm start

- les messages 2 messages s'afficheront :

Listening anytime on port 3000

Connexion réussie

- vous serrez en mesure de faire tourner l'API.