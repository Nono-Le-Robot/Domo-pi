const express = require('express');
const https = require('https'); // Utilisez le module 'https' pour HTTPS
const fs = require('fs');
const Gpio = require('onoff').Gpio;

const app = express();
const led = new Gpio(6, 'out'); // Utilisez le bon numéro de GPIO

app.use(express.static('public')); // Dossier pour les fichiers statiques (HTML, CSS, JS)

app.get('/on', (req, res) => {
  led.writeSync(1); // Allumer la LED
  res.send('LED allumée');
});

app.get('/off', (req, res) => {
  led.writeSync(0); // Éteindre la LED
  res.send('LED éteinte');
});

// Configuration pour le serveur HTTPS
const privateKey = fs.readFileSync('/chemin/vers/server.key', 'utf8');
const certificate = fs.readFileSync('/chemin/vers/server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
  console.log('Serveur HTTPS démarré sur le port 443');
});
