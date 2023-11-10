const mic = document.querySelector("#mic")

//============================= Speech Recognition ==========================
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var recognition = new SpeechRecognition();
const assistName = "auto"
recognition.continuous = false;
recognition.lang = 'fr-FR';
//============================= addEventListener ==========================

mic.addEventListener("click", () => {
        recognition.start()
})

//============================= Functions ==========================
recognition.onstart = function () {
}

function readOut(message){
    const speech = new SpeechSynthesisUtterance();
    const allVoices = speechSynthesis.getVoices()
    speech.text = message
    speech.volume = 0.5
    window.speechSynthesis.speak(speech)
}

recognition.onresult = function (event){
    let current = event.resultIndex
    let transcript = event.results[current][0].transcript
    console.log(transcript);
    transcript = transcript.toLowerCase(); 
    if(transcript.includes("allume l'avant'")  ){
        console.log(transcript)
        fetch('/on-front');
        transcript = ""         
        readOut("l'avant est allumé")
    }
    if(transcript.includes("éteins l'avant")  ){
        console.log(transcript)
        fetch('/off-front');
        transcript = ""         
        readOut("l'avant est eteins")
    }

    if(transcript.includes("allume l'arrière")  ){
        console.log(transcript)
        fetch('/on-back');
        transcript = ""         
        readOut("l'arriere est allumé")
    }
    if(transcript.includes("éteins l'arrière")  ){
        console.log(transcript)
        fetch('/off-back');
        transcript = ""         
        readOut("l'arriere est eteins")
    }

    if(transcript.includes("allume tout")  ){
        console.log(transcript)
        fetch('/on-all');
        transcript = ""         
        readOut("tout est allumé")
    }

    if(transcript.includes("éteins tout")  ){
        console.log(transcript)
        fetch('/off-all');
        transcript = ""         
        readOut("tout est eteins")
    }
}

recognition.onend = function () {
 recognition.start();
}