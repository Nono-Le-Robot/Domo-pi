const express = require('express');
const Gpio = require('onoff').Gpio;
const app = express();
const ledFront = new Gpio(6, 'out'); // Utilisez le bon numéro de GPIO
const ledBack = new Gpio(5, 'out'); // Utilisez le bon numéro de GPIO


app.use(express.static('public')); // Dossier pour les fichiers statiques (HTML, CSS, JS)

app.get('/status', (req, res) => {
  const status = {
    front: ledFront.readSync(),
    back: ledBack.readSync(),
  };
  res.json(status);
});


app.get('/on-front', (req, res) => {
  ledFront.writeSync(1); // Allumer la LED
  res.send('LED allumée');
});

app.get('/off-front', (req, res) => {
  ledFront.writeSync(0); // Éteindre la LED
  res.send('LED éteinte');
});

app.get('/on-back', (req, res) => {
  ledBack.writeSync(1); // Allumer la LED
  res.send('LED allumée');
});

app.get('/off-back', (req, res) => {
  ledBack.writeSync(0); // Éteindre la LED
  res.send('LED éteinte');
});


app.get('/off-all', (req, res) => {
  ledBack.writeSync(0); // Éteindre la LED
  ledFront.writeSync(0);
  res.send('LED éteinte');
});

app.get('/on-all', (req, res) => {
  ledBack.writeSync(1); // Éteindre la LED
  ledFront.writeSync(1);
  res.send('LED éteinte');

});

app.get('/on-all-timer', (req, res) => {
  ledBack.writeSync(1);
  ledFront.writeSync(1);
  
  const duration = parseInt(req.query.duration) || 0; // Récupérer la durée depuis les paramètres de la requête

  setTimeout(() => {
      ledBack.writeSync(0);
      ledFront.writeSync(0);
  }, duration);

  res.send(`LED allumée pendant ${duration} ${duration > 1 ? 'minutes' : 'minute'}`);
});

const server = app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
