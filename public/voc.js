//============================= Selectors ==========================
const switchElementFront = document.querySelector('.switch-front');
const switchElementBack = document.querySelector('.switch-back');
const pastilleFront = document.querySelector('#pastille-avant');
const pastilleBack = document.querySelector('#pastille-arriere');
const divHumidity = document.querySelector('#humidity-data')
const divTemperature = document.querySelector('#temperature-data');

//============================= Variables ==========================
let loaded = false;
let temperature = 0;
let humidity = 0;
let alreadyClick = false;

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
            temperature = status.temperature.toFixed(1)
            humidity = status.humidity.toFixed(1)
            divHumidity.innerHTML = humidity;
            divTemperature.innerHTML = temperature;

            if(loaded){
                document.querySelector('#app').style.display = "flex"
                document.querySelector('.loading-window').style.display = "none"
                pastilleFront.style.display = 'flex';
                pastilleBack.style.display = 'flex';
            }
            else{
                document.querySelector('.loading-window').style.display = "flex"
                document.querySelector('#app').style.display = "none"
            }

            if(status.front){
                if(!loaded){
                    if(switchElementFront.classList.contains('off-red-light')) switchElementFront.classList.remove('off-red-light');
                }
                pastilleFront.style.backgroundColor = 'rgb(106, 245, 96);';
            }
            else{
                if(!loaded){
                switchElementFront.classList.add('off-red-light');
                }
                pastilleFront.style.backgroundColor = 'rgb(245, 96, 96)';
            }

            if(status.back){
                if(!loaded){
                if(switchElementBack.classList.contains('off-red-light')) switchElementBack.classList.remove('off-red-light');
                }
                pastilleBack.style.backgroundColor = 'rgb(106, 245, 96)';
            }
            else{
                if(!loaded){
                switchElementBack.classList.add('off-red-light');
                }
                pastilleFront.style.backgroundColor = 'rgb(245, 96, 96)';
            }
            loaded = true
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de l\'état des LED:', error);
        });
}

setInterval(() => {
    fetchStatus();
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
                if(switchElementFront.classList.contains('off-red-light')) switchElementFront.classList.remove('off-red-light');
                turnOnFront();
                readOut("l'avant est allumé");
            } else if (transcript.includes("arrière")) {
                if(switchElementBack.classList.contains('off-red-light')) switchElementBack.classList.remove('off-red-light');
                turnOnBack();
                readOut("l'arrière est allumé");
            } else if (transcript.includes("tout")) {
                if(switchElementFront.classList.contains('off-red-light')) switchElementFront.classList.remove('off-red-light');
                if(switchElementBack.classList.contains('off-red-light')) switchElementBack.classList.remove('off-red-light');
                turnOnAll();
                readOut("tout est allumé");
            }
    } else if (transcript.includes("éteins") || transcript.includes ("est à")) {
        if (transcript.includes("avant") || transcript.includes('vent') || transcript.includes('lampe')) {
            switchElementFront.classList.add('off-red-light');
            turnOffFront()
            readOut("l'avant est éteint");
        } else if (transcript.includes("arrière")) {
            switchElementBack.classList.add('off-red-light');
            turnOffBack()
            readOut("l'arrière est éteint");
        } else if (transcript.includes("tout")) {
            switchElementFront.classList.add('off-red-light');
            switchElementBack.classList.add('off-red-light');
            turnOffAll();
            readOut("tout est éteint");
        }
    }
    
    const match = transcript.match(/allume pendant (\d+) (minute|minutes)/);
    if (match) {
        const minutes = parseInt(match[1]);
        let timerDuration = minutes * 60 * 1000;
        switchElementFront.classList.add('off-red-light');
        switchElementBack.classList.add('off-red-light');
        fetch(`/on-all-timer?duration=${timerDuration}`).then(()=>{
            setTimeout(() => {
                if(switchElementFront.classList.contains('off-red-light')) switchElementFront.classList.remove('off-red-light');
                if(switchElementBack.classList.contains('off-red-light')) switchElementBack.classList.remove('off-red-light');
            }, timerDuration);
        });
        readOut(`tout est allumé pendant ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`);
    }    
    if(transcript.includes('une') && transcript.includes('minute') && transcript.includes('allume')){
        const minutes = 1;
        let timerDuration = minutes * 60 * 1000;
        switchElementFront.classList.add('off-red-light');
        switchElementBack.classList.add('off-red-light');

        fetch(`/on-all-timer?duration=${timerDuration}`).then(()=>{
            setTimeout(() => {
                if(switchElementFront.classList.contains('off-red-light')) switchElementFront.classList.remove('off-red-light');
                if(switchElementBack.classList.contains('off-red-light')) switchElementBack.classList.remove('off-red-light');
            }, timerDuration);
        });
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
        if(switchElementFront.classList.contains('off-red-light')) switchElementFront.classList.remove('off-red-light');
        fetch('/on-front')
    }
    else{
        switchElementFront.classList.add('off-red-light');
        fetch('/off-front')
    }
}

function toggleSwitchRedLightBack() {
    if(switchElementBack.classList.contains('off-red-light')){
        if(switchElementBack.classList.contains('off-red-light')) switchElementBack.classList.remove('off-red-light');
        fetch('/on-back')
    }
    else{
        switchElementBack.classList.add('off-red-light');
        fetch('/off-back')
    }
}