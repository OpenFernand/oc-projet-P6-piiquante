# Projet P6-Piquante

Construisez une API sécurisée pour une application d'avis gastronomiques

Installation et mise en service du backend :

- téléchargement du PROJET ci-dessous :

$ git clone https://github.com/OpenFernand/oc-projet-P6-piiquante.git 

- puis, sur TERMINAL dans le dossier racine du projet taper :

$ npm install --force

- puis, création du fichier .env à la racine du répertoire et y inscrire les valeurs correctes , ci-dessous, pour se connecter à une base de donnée mongoDB :

PORT = 3000 (le front fonctionne bien avec le backend sur le port 3000)

DB_USERNAME="username de la base de donnée mongodb"

DB_PASSWORD="password de la base de donnée mongodb"

DB_CLUSTER = "cluster de la base de donnée mongodb"

JWT_KEY_TOKEN = "XXXXX"

ou prendre le fichier .example.env, mettre les bonnes valeurs et modifier le nom du fichier en .env

- et enfin, taper :

$ nodemon ou npm start
