const mic = document.querySelector("#mic");

//============================= Speech Recognition ==========================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'fr-FR';

//============================= addEventListener ==========================

mic.addEventListener("click", () => {
    recognition.start();
});

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
    else if(transcript.includes('1') && transcript.includes('minute') && transcript.includes('allume')){
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
