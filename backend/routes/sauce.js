const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // middleware permettant d'authentifier les pages de l'application

const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config'); // middleware définissant la destination et le nom fichier des images


router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;