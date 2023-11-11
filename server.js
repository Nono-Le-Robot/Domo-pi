const express = require('express');
const Gpio = require('onoff').Gpio;
const app = express();
const ledFront = new Gpio(6, 'out');
const ledBack = new Gpio(5, 'out');

app.use(express.static('public'));

app.get('/status', (req, res) => {
  const status = {
    front: ledFront.readSync(),
    back: ledBack.readSync(),
  };
  res.json(status);
});

app.get('/on-front', (req, res) => {
  ledFront.writeSync(1);
  res.send('LED allumée');
});

app.get('/off-front', (req, res) => {
  ledFront.writeSync(0);
  res.send('LED éteinte');
});

app.get('/on-back', (req, res) => {
  ledBack.writeSync(1);
  res.send('LED allumée');
});

app.get('/off-back', (req, res) => {
  ledBack.writeSync(0);
  res.send('LED éteinte');
});

app.get('/off-all', (req, res) => {
  ledBack.writeSync(0);
  ledFront.writeSync(0);
  res.send('LED éteinte');
});

app.get('/on-all', (req, res) => {
  ledBack.writeSync(1);
  ledFront.writeSync(1);
  res.send('LED éteinte');

});

app.get('/on-all-timer', (req, res) => {
  ledBack.writeSync(1);
  ledFront.writeSync(1);
  const duration = parseInt(req.query.duration) || 0;
  setTimeout(() => {
      ledBack.writeSync(0);
      ledFront.writeSync(0);
  }, duration);
  res.send(`LED allumée pendant ${duration} ${duration > 1 ? 'minutes' : 'minute'}`);
});

const server = app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
