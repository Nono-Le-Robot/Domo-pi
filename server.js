const express = require('express');
const Gpio = require('onoff').Gpio;
const app = express();
const led = new Gpio(6, 'out'); // Utilisez le bon numéro de GPIO

const { initSpeechRecognition, startListening } = require('speech-recognition');

initSpeechRecognition();

app.use(express.static('public')); // Dossier pour les fichiers statiques (HTML, CSS, JS)

app.get('/on', (req, res) => {
  led.writeSync(1); // Allumer la LED
  res.send('LED allumée');
});

app.get('/off', (req, res) => {
  led.writeSync(0); // Éteindre la LED
  res.send('LED éteinte');
});

// Écoute la commande vocale pour allumer la LED
app.get('/listen', (req, res) => {
  startListening((command) => {
    if (command === 'allume la led') {
      led.writeSync(1); // Allumer la LED
      res.send('LED allumée');
    } else if (command === 'éteins la led') {
      led.writeSync(0); // Éteindre la LED
      res.send('LED éteinte');
    } else {
      res.send('Commande vocale non reconnue');
    }
  });
});


const server = app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
