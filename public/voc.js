var switchElementFront = document.querySelector('.switch-front');
var switchElementBack = document.querySelector('.switch-back');
let loaded = true
let temperature = 0;
let humidity = 0;
let frontLightState = 0;
let backLightState = 0;

//============================= Speech Recognition ==========================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'fr-FR';
recognition.start();

function fetchStatus() {
    fetch('/status')
        .then(response => response.json())
        .then(status => {
            temperature = status.temperature
            humidity = status.humidity
            frontLightState = status.front
            backLightState = status.back
            const divHumidity = document.querySelector('#humidity-data')
            const divTemperature = document.querySelector('#temperature-data');
            divHumidity.innerHTML = humidity.toFixed(1);
            divTemperature.innerHTML = temperature.toFixed(1);
            if(status.front){
                if(switchElementFront.classList.contains('off-red-light')) switchElementFront.classList.remove('off-red-light');
            }
            else{
                switchElementFront.classList.add('off-red-light');
            }
            if(status.back){
                if(switchElementBack.classList.contains('off-red-light')) switchElementBack.classList.remove('off-red-light');
            }
            else{
                switchElementBack.classList.add('off-red-light');
            }
            loaded = true
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de l\'état des LED:', error);
        });
}

setInterval(() => {
    fetchStatus();
    if(loaded){
        document.querySelector('#app').style.display = "flex"
        document.querySelector('.loading-window').style.display = "none"
    }
    else{
        document.querySelector('.loading-window').style.display = "flex"
        document.querySelector('#app').style.display = "none"
    }
}, 1000);

//============================= Functions ==========================
recognition.onstart = function () {
    console.log("Speech recognition started.");
};

function readOut(message) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 0.5;
    window.speechSynthesis.speak(speech);
}

recognition.onresult = function (event) {
    const current = event.resultIndex;
    let transcript = event.results[current][0].transcript.toLowerCase();
    console.log(transcript)
    if(transcript.includes('donovan') || transcript.includes('domo van') || transcript.includes('de nova') || transcript.includes('domova') || transcript.includes("mauvanne")|| transcript.includes("momova") || transcript.includes('tomova') || transcript.includes('nouveau van') || transcript.includes('beauval') || transcript.includes('mot van')){
        if(transcript.includes('quel')){
            if(transcript.includes('température')){
                readOut(`la température est de ${temperature} degrès`)
            }
            if(transcript.includes('humidité')){
                readOut(`le taux d'humidité est de ${humidity} pourcents`)
            }
        }
        if (transcript.includes("allume")) {
            if (transcript.includes("avant") || transcript.includes('vent') || transcript.includes('lampe')) {
                fetch('/on-front');
                readOut("l'avant est allumé");
            } else if (transcript.includes("arrière")) {
                fetch('/on-back');
                readOut("l'arrière est allumé");
            } else if (transcript.includes("tout")) {
            fetch('/on-all');
            readOut("tout est allumé");
        }
    } else if (transcript.includes("éteins") || transcript.includes ("est à")) {
        if (transcript.includes("avant") || transcript.includes('vent') || transcript.includes('lampe')) {
            fetch('/off-front');
            readOut("l'avant est éteint");
        } else if (transcript.includes("arrière")) {
            fetch('/off-back');
            readOut("l'arrière est éteint");
        } else if (transcript.includes("tout")) {
            fetch('/off-all');
            readOut("tout est éteint");
        }
    }
    
    const match = transcript.match(/allume pendant (\d+) (minute|minutes)/);
    if (match) {
        const minutes = parseInt(match[1]);
        let timerDuration = minutes * 60 * 1000;
        fetch(`/on-all-timer?duration=${timerDuration}`);
        readOut(`tout est allumé pendant ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`);
    }    
    if(transcript.includes('une') && transcript.includes('minute') && transcript.includes('allume')){
        const minutes = 1
        let timerDuration = minutes * 60 * 1000;
        fetch(`/on-all-timer?duration=${timerDuration}`);
        readOut(`tout est allumé pendant ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`);
    }   
}
};

recognition.onend = function () {
    console.log("Speech recognition ended. Restarting...");
    recognition.start();
};

function turnOnFront() {
    fetch('/on-front');
}

function turnOffFront() {
    fetch('/off-front');
}

function turnOnBack() {
    fetch('/on-back');
}
function turnOffBack() {
    fetch('/off-back');
}

function turnOnAll() {
    fetch('/on-all');
}
function turnOffAll() {
    fetch('/off-all');
}

function toggleSwitchRedLightFront() {
    if(switchElementFront.classList.contains('off-red-light')){
        fetch('/on-front')
    }
    else{
        fetch('/off-front')
    }
}

function toggleSwitchRedLightBack() {
    if(switchElementBack.classList.contains('off-red-light')){
        fetch('/on-back')
    }
    else{
        fetch('/off-back')
    }
}