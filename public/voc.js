const mic = document.querySelector("#mic");

//============================= Speech Recognition ==========================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'fr-FR';

//============================= addEventListener ==========================
recognition.start();
function fetchLEDStatus() {
    var switchElementFront = document.querySelector('.switch-front');
    var switchElementBack = document.querySelector('.switch-back');
    fetch('/status')
        .then(response => response.json())
        .then(status => {
            if(status.front){
                switchElementFront.classList.remove('off-red-light');
            }
            else{
                switchElementFront.classList.add('off-red-light');
            }
            if(status.back){
                switchElementBack.classList.remove('off-red-light');
            }
            else{
                switchElementBack.classList.add('off-red-light');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de l\'état des LED:', error);
        });
}
fetchLEDStatus();

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
    var switchElementFront = document.querySelector('.switch-front');
    var switchElementBack = document.querySelector('.switch-back');
    const current = event.resultIndex;
    let transcript = event.results[current][0].transcript.toLowerCase();
    
    console.log(transcript);

    if (transcript.includes("allume")) {
        if (transcript.includes("avant") || transcript.includes('vent') || transcript.includes('lampe')) {
            fetch('/on-front');
            if(switchElementFront.classList.contains('off-red-light')) switchElementFront.classList.remove('off-red-light');
            readOut("l'avant est allumé");
        } else if (transcript.includes("arrière")) {
            fetch('/on-back');
            if(switchElementBack.classList.contains('off-red-light')) switchElementBack.classList.remove('off-red-light');
            readOut("l'arrière est allumé");
        } else if (transcript.includes("tout")) {
            fetch('/on-all');
            if(switchElementFront.classList.contains('off-red-light')) switchElementFront.classList.remove('off-red-light');
            if(switchElementBack.classList.contains('off-red-light')) switchElementBack.classList.remove('off-red-light');
            readOut("tout est allumé");
        }
    } else if (transcript.includes("éteins")) {
        if (transcript.includes("avant") || transcript.includes('vent') || transcript.includes('lampe')) {
            fetch('/off-front');
            switchElementFront.classList.add('off-red-light');
            readOut("l'avant est éteint");
        } else if (transcript.includes("arrière")) {
            fetch('/off-back');
            switchElementBack.classList.add('off-red-light');
            readOut("l'arrière est éteint");
        } else if (transcript.includes("tout")) {
            fetch('/off-all');
            switchElementFront.classList.add('off-red-light');
            switchElementBack.classList.add('off-red-light');
            readOut("tout est éteint");
        }
    }

    const match = transcript.match(/allume pendant (\d+) (minute|minutes)/);
    if (match) {
        const minutes = parseInt(match[1]);
        let timerDuration = minutes * 60 * 1000; // Convertit les minutes en millisecondes
        fetch(`/on-all-timer?duration=${timerDuration}`);
        var switchElementFront = document.querySelector('.switch-front');
        var switchElementBack = document.querySelector('.switch-back');
        switchElementFront.classList.remove('')
        if(switchElementBack.classList.contains('off-red-light')) switchElementBack.classList.remove('off-red-light');
        if(switchElementFront.classList.contains('off-red-light')) switchElementBack.classList.remove('off-red-light');
        readOut(`tout est allumé pendant ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`);
        setTimeout(() => {
         switchElementBack.classList.add('off-red-light');
         switchElementBack.classList.add('off-red-light');
        }, timerDuration);
    }    
    if(transcript.includes('une') && transcript.includes('minute') && transcript.includes('allume')){
        const minutes = 1
        let timerDuration = minutes * 60 * 1000; // Convertit les minutes en millisecondes
        fetch(`/on-all-timer?duration=${timerDuration}`);
        readOut(`tout est allumé pendant ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`);
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

function toggleSwitchRedLightFront(toggle) {
    var switchElementFront = toggle.querySelector('.switch-front');
    switchElementFront.classList.toggle('off-red-light');
    if(switchElementFront.classList.contains('off-red-light')){
        fetch('/off-front')
    }
    else{
        fetch('/on-front')
    }
  }


  function toggleSwitchRedLightBack(toggle) {
    var switchElementBack = toggle.querySelector('.switch-back');
    switchElementBack.classList.toggle('off-red-light');
    if(switchElementBack.classList.contains('off-red-light')){
        fetch('/off-back')
    }
    else{
        fetch('/on-back')
    }
  }


