const mic = document.querySelector("#mic");

//============================= Speech Recognition ==========================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'fr-FR';

//============================= addEventListener ==========================
recognition.start();

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
    
    console.log(transcript);

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
    } else if (transcript.includes("éteins")) {
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
        let timerDuration = minutes * 60 * 1000; // Convertit les minutes en millisecondes
        fetch(`/on-all-timer?duration=${timerDuration}`);
        readOut(`tout est allumé pendant ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`);
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
    var switchElement = toggle.querySelector('.switch');
    switchElement.classList.toggle('off-red-light');
    if(switchElement.classList.contains('off-red-light')){
        fetch('/on-front')
    }
    else{
        fetch('/off-front')
    }
  }


  function toggleSwitchRedLightBack(toggle) {
    var switchElement = toggle.querySelector('.switch');
    switchElement.classList.toggle('off-red-light');
    if(switchElement.classList.contains('off-red-light')){
        fetch('/on-back')
    }
    else{
        fetch('/off-back')
    }
  }