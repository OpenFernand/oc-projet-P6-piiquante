const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');// email validator package

exports.signup = (req, res, next) => {
const maxPasswordLength = 8
    if (!emailValidator.validate(req.body.email)) return res.status(403).json({ message: 'Le format adresse mail est incorrect !' })
    if (req.body.password.length > maxPasswordLength) {
        User.findOne({ email: req.body.email }) // unicite du email : d'abord, on cherche un potentiel utilisateur déjà inscrit avec le même email
            .then((oldUser) => {
                if (oldUser) {  // utilisateur inscrit avec le même email existant, alors retourne une réponse
                    return res.status(409).json({ message: 'Identifiant / mot de passe incorrect !' });

                } else {  // pas d'utilisateur déjà inscrit avec le même email, on peut inscrire le nouvel utilisateur
                    bcrypt.hash(req.body.password, 10)
                        .then((hash) => {
                            const newUser = new User({  // créer un nouveau user
                                email: req.body.email,  
                                password: hash,  
                            });

                            newUser.save() // sauvegarde du nouveau user
                                .then(() => res.status(201).json({ message: 'Utilisateur créé YES!!!!' }))
                                .catch((error) => res.status(400).json({ error }));
                        })
                        .catch((error) => res.status(500).json({ error }));
                }
            })
            .catch((error) => res.status(500).json({ error }));
    } else return res.status(403).json({ message: `Le mot de passe doit contenir ${maxPasswordLength} caractères minimum !` });
}

// Connexion de l'utilisateur
exports.login = (req, res, next) => {

    User.findOne({ email: req.body.email }) // vérifie l'existence de l'adresse mail dans BDD
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Identifiant / mot de passe incorrect !' });
            }
            bcrypt.compare(req.body.password, user.password) // si existence de user, comparaison des passwords
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Identifiant / mot de passe incorrect !' });
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