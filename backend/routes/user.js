const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Routes pour créer un compte ou se connecté transmis par le front end
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Export du router
module.exports = router;