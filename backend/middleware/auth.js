const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // Récupération Token
       const decodedToken = jwt.verify(token, `${process.env.JWT_KEY_TOKEN}`); // Vérification token
       const userId = decodedToken.userId; // Récupèration de l'id du token

       req.auth = {
           userId: userId
       }

       console.log('Le userId :' , userId)
       console.log('Le token : ' , userId)       

       next();

   } catch(error) {
       res.status(401).json({ error: new Error('Requête non authentifiée Grrrr!! !') });
   }
};