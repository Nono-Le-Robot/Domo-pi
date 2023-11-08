const Gpio = require('onoff').Gpio;
const port_GPIO = 6;
const LED = new Gpio(port_GPIO, 'out');
const blinkInterval = setInterval(blinkLED, 250);

console.clear();
console.log("========================================");
function blinkLED() {
    if (LED.readSync() === 0) {
        LED.writeSync(1);
        console.log('led on');
    } else {
        LED.writeSync(0);
        console.log('led off');
    }
}
function endBlink() {
    clearInterval(blinkInterval);
    LED.writeSync(0);
    console.log('led off');
    LED.unexport();
}
setTimeout(endBlink, 5000);
console.log("========================================");