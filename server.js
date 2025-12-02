const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('public'));

// Définir le chemin du répertoire public
const publicPath = path.join(__dirname, 'public');

// raccourci l'url pour plus de clarté
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, '/index/accueil.html'));
});
app.get('/resource', (req, res) => {
  res.sendFile(path.join(publicPath, '/index/search.html'));
});
app.get('/depot', (req, res) => {
  res.sendFile(path.join(publicPath, '/index/depot.html'));
})
app.get('/events', (req, res) => {
  res.sendFile(path.join(publicPath, '/index/events.html'));
});
app.get('/charte', (req, res) => {
  res.sendFile(path.join(publicPath, '/index/charte.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, '/index/login.html'));
});
app.get('/disconnect', (req, res) => {
  res.sendFile(path.join(publicPath, '/index/disconnect.html'));
});

// Écouter le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Le serveur est en cours d\'écoute sur le port 3000...');
});
