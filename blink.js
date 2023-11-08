const Gpio = require('onoff').Gpio;
const port_GPIO = 6;
const LED = new Gpio(port_GPIO, 'out');
const blinkInterval = setInterval(blinkLED, 200);

console.clear();
console.log("========================================");

function blinkLED() {
    if (LED.readSync() === 0) {
        LED.writeSync(1);
        console.log("LED STATUS : ON");
    } else {
        LED.writeSync(0);
        console.log("LED STATUS : OFF");
    }
}

function endBlink() {
    clearInterval(blinkInterval);
    LED.writeSync(0);
    console.log("LED STATUS : OFF");
    LED.unexport();
    console.log("========================================");
}

// setTimeout(endBlink, 5000);
