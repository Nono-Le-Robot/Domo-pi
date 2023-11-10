const localtunnel = require('localtunnel');

function restartLocalTunnel() {
  const tunnel = localtunnel(5000, { subdomain: 'lumvroom' }, (err, tunnel) => {
    if (err) {
      console.error('Erreur lors du démarrage de LocalTunnel :', err.message);
    } else {
      console.log(`LocalTunnel démarré avec l'URL : ${tunnel.url}`);
    }
  });

  tunnel.on('close', () => {
    console.log('LocalTunnel fermé. Redémarrage...');
    restartLocalTunnel(); // Redémarrez LocalTunnel en cas de fermeture inattendue
  });
}

restartLocalTunnel();
