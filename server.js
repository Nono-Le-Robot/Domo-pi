const express = require('express');
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

const server = app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
