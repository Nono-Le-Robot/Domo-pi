const express = require('express');
const Gpio = require('onoff').Gpio;
var sensor = require("node-dht-sensor");
const app = express();
const ledFront = new Gpio(6, 'out');
const ledBack = new Gpio(5, 'out');
let timerId;

app.use(express.static('public'));

app.get('/status', (req, res) => {

  sensor.read(22, 26, function(err, temperature, humidity) {
    const status = {
      front: ledFront.readSync(),
      back: ledBack.readSync(),
      temperature : temperature,
      humidity :  humidity
    };
    res.json(status);
  });
});

app.get('/on-front', (req, res) => {
  ledFront.writeSync(1);
  res.send('LED allumée');
  clearTimeout(timerId);
});

app.get('/off-front', (req, res) => {
  ledFront.writeSync(0);
  res.send('LED éteinte');
  clearTimeout(timerId);
});

app.get('/on-back', (req, res) => {
  ledBack.writeSync(1);
  res.send('LED allumée');
  clearTimeout(timerId);
});

app.get('/off-back', (req, res) => {
  ledBack.writeSync(0);
  res.send('LED éteinte');
  clearTimeout(timerId);
});

app.get('/off-all', (req, res) => {
  ledBack.writeSync(0);
  ledFront.writeSync(0);
  res.send('LED éteinte');
  clearTimeout(timerId);
});

app.get('/on-all', (req, res) => {
  ledBack.writeSync(1);
  ledFront.writeSync(1);
  res.send('LED allumée');
  clearTimeout(timerId);
});

const timer = (duration) => {
  timerId = setTimeout(() => {
    ledBack.writeSync(0);
    ledFront.writeSync(0);
  }, duration);
};

app.get('/on-all-timer', (req, res) => {
  ledBack.writeSync(1);
  ledFront.writeSync(1);
  const duration = parseInt(req.query.duration) || 0;
  timer(duration);
  res.send(`LED allumée pendant ${duration} ${duration > 1 ? 'minutes' : 'minute'}`);
});

const server = app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
