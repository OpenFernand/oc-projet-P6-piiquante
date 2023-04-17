const express = require('express'); // Importation d'express => Framework basé sur node.js
const mongoose = require('mongoose'); // Plugin Mongoose pour se connecter à la data base Mongo Db
const bodyParser = require('body-parser'); // Permet d'extraire l'objet JSON des requêtes POST
const saucesRoutes = require('./routes/sauce'); // Importe la route dédiée aux sauces
const userRoutes = require('./routes/user'); // Importe la route dédiée aux users
const helmet = require('helmet'); // Module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
const path = require('path');  // Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier
const dotenv = require("dotenv").config(); //Importation de dotenv pour les variables d'environement

const app = express();// Création d'une application express (utilisation du framework express) 

// Connexion à l'API grace à Mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
      useUnifiedTopology: true
    }) 
    .then(() => console.log('Connexion réussie chouette ! chouette ! chouette !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// CORS - partage de ressources entre serveurs
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(helmet());

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use(bodyParser.json()); // Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable

app.use('/images', express.static(path.join(__dirname, 'images'))); // Chemin statique pour fournir images de manière statiques

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// Export de l'Application
module.exports = app;