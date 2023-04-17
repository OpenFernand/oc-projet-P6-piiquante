const mongoose = require('mongoose');

//const uniqueValidator = require('mongoose-unique-validator'); // package vérification d'un email unique

const userSchema = mongoose.Schema({ // Schema du modèle user exigé
    email: { type: String, required: true, unique: true }, // Unique -> une adresse mail = un user
    password: { type : String, required: true}
});

console.log('Dans models userSchema new : ' , userSchema)

// userSchema.plugin(uniqueValidator); // utilisation du package. Il semble qu'il y ait un probleme de version !!!

module.exports = mongoose.model('User', userSchema); // Classe 'User' dans ../models/User
