const Gpio = require('onoff').Gpio;
const port_GPIO = 6;
const LED = new Gpio(port_GPIO, 'out'); 

LED.writeSync(0);
LED.unexport();

console.clear();
console.log("========================================");
console.log("LED STATUS : OFF");
console.log("========================================");
