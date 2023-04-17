const Sauce = require('../models/Sauce'); // (Sauce vs sauce)import du modèle Sauce
const fs = require('fs'); // File system, package permettant la modification ou suppression des fichiers

// création des sauces
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // URL de l'image enregistrée dans image du serveur egalement stockée dans la bdd  
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce est enregistrée !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

// Modification d'une sauce (photo ou autres informations)
exports.modifySauce = (req, res, next) => {
    //l'objet qui va être envoyé dans la base de donnée
    const sauceObject = req.file ? // on vérifie si la modification concerne le body ou un nouveau fichier image
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
      : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
          res.status(403).json({ message: "requete non authorisée" });

        } else if (sauceObject.imageUrl == undefined) {
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce mise à jour" }))
            .catch((error) => res.status(401).json({ error }));
        // suppression dans image et updade dans BDD
        } else if (sauceObject.imageUrl != undefined) {
          Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
              const filename = sauce.imageUrl.split("/images/")[1];                      
              fs.unlink(`images/${filename}`, () => { //suppression dans /image de l'image de la sauce qui sera remplacée par la nouvelle image de sauce
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // mise à jour dans la BDD
                  .then(() => res.status(200).json({ message: "Sauce mise à jour, image mise à jour" }))
                  .catch((error) => res.status(401).json({ error }));
              });
            })
            .catch((error) => res.status(401).json({ error }));
        }
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  };

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // on récupère l'adresse de l'image
            fs.unlink(`images/${filename}`, () => { // supprime du serveur /images
                Sauce.deleteOne({ _id: req.params.id }) // supprime la sauce de la bdd
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }));
};

// Obtenir toutes les sauces
exports.getAllSauces = (req, res, next) => { // récupèrer toutes les sauces
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};

// Obtennir 1 sauce sélectionnée
exports.getOneSauce = (req, res, next) => {  // récupèrer une seule sauce
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
};

// Gestion des Like et Dislike
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    if (like === 1) { // Utilisateur aime la sauce : Bouton j'aime
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Vous aimez cette sauce' }))
            .catch(error => res.status(400).json({ error }))

    } else if (like === -1) { // Utilisateur n'aime pas la sauce : Bouton je n'aime pas
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Vous n’aimez pas cette sauce' }))
            .catch(error => res.status(400).json({ error }))

    } else {    // Utilisateur fait une annulation du bouton j'aime ou alors je n'aime pas
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Vous n’aimez plus cette sauce' }))
                        .catch(error => res.status(400).json({ error }))
                }

                else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Vous aimerez peut-être cette sauce à nouveau' }))
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
};