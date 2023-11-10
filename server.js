const express = require('express');
const Gpio = require('onoff').Gpio;
const app = express();
const ledWhite = new Gpio(6, 'out'); // Utilisez le bon numéro de GPIO
const ledRed = new Gpio(5, 'out'); // Utilisez le bon numéro de GPIO


app.use(express.static('public')); // Dossier pour les fichiers statiques (HTML, CSS, JS)

app.get('/on-white', (req, res) => {
  ledWhite.writeSync(1); // Allumer la LED
  res.send('LED allumée');
});

app.get('/off-white', (req, res) => {
  ledWhite.writeSync(0); // Éteindre la LED
  res.send('LED éteinte');
});

app.get('/on-red', (req, res) => {
  ledRed.writeSync(1); // Allumer la LED
  res.send('LED allumée');
});

app.get('/off-red', (req, res) => {
  ledRed.writeSync(0); // Éteindre la LED
  res.send('LED éteinte');
});


const server = app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
