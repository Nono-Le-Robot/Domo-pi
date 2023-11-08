const Gpio = require('onoff').Gpio;
const port_GPIO = 6;
const LED = new Gpio(port_GPIO, 'out'); 

LED.writeSync(1);
LED.unexport();

console.clear();
console.log("========================================");
console.log('led off');
console.log("========================================");