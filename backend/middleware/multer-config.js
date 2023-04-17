const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => { // enregistre les fichiers dans le dossier images
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // utilise le nom d'origine, remplacer espaces par underscores et ajouter un timestamp
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    console.log(name + Date.now() + '.' + extension)
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image'); //gére uniquement les téléchargements de fichiers image