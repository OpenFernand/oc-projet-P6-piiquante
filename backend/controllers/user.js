const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config(); //Importation de dotenv pour les variables d'environement
const emailValidator = require('email-validator');// email validator package
const cryptojs = require('crypto-js'); //Importation de crypto-js pour chiffrer le mail
const passwordValidator = require('password-validator'); // Importation password validator package

/*
const passwordSchema = new passwordValidator(); //création du schéma
passwordSchema //le schéma doit respecter le mot de passe 
    .is().min(8)                                    // Minimum length 8
    .is().max(50)                                  // Maximum length 50
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                // Must have at least 1 digit
    .has().not().spaces();                         // Has no espaces

//vérification de la qualité du password par rapport au schéma :
module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    }
    else{
        res.status(400).json({error : `Le mot de passe n'est pas assez fort ${passwordSchema.validate('req.body.password', {list: true})}`})
    }
}
*/

exports.signup = (req, res, next) => {

    if (!emailValidator.validate(req.body.email)) return res.status(403).json({ message: 'Le format adresse mail est incorrect !' })
    if (req.body.password.length > 5) {
        User.findOne({ email: req.body.email }) // unicite du mail : d'abord, on cherche un potentiel utilisateur déjà inscrit avec le même email
            .then((oldUser) => {
                if (oldUser) {  //un utilisateur inscrit avec le même email existe, alors retourne une réponse
                    return res.status(409).json({ message: 'L adresse mail existe déja' });

                } else {  // pas d'utilisateur déjà inscrit avec le même email, on peut inscrire le nouvel utilisateur
                    bcrypt.hash(req.body.password, 10)
                        .then((hash) => {
                            const newUser = new User({  // créer un nouveau user
                                email: req.body.email,  // l'adresse mail
                                password: hash,  // le mot de passe haché
                            });

                            newUser.save()
                                .then(() => res.status(201).json({ message: 'Utilisateur créé YES!!!!' }))
                                .catch((error) => res.status(400).json({ error }));
                        })
                        .catch((error) => res.status(500).json({ error }));
                }
            })
            .catch((error) => res.status(500).json({ error }));
    } else return res.status(403).json({ message: 'Le mot de passe doit contenir 6 caractères minimum !' });
};

// Connexion de l'utilisateur
exports.login = (req, res, next) => {

    User.findOne({ email: req.body.email }) // vérifie l'existence de l'adresse mail dans BDD
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password) // si existence de user, comparaison des passwords
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( // On génère un token de session pour le user maintenant connecté
                            { userId: user._id },
                            `${process.env.JWT_KEY_TOKEN}`,  // La clé de chiffrement du token
                            { expiresIn: '24h' } // Durée de validité du token
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // erreur serveur
};