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
    if(transcript.includes("allume la led blanche")  ){
        console.log(transcript)
        fetch('/on-white');

        
        transcript = ""         
        readOut("la led est allumée")
    }
    if(transcript.includes("éteins la led blanche")  ){
        console.log(transcript)
        fetch('/off-white');
        transcript = ""         
        readOut("la led est eteinte")
    }

    if(transcript.includes("allume la led rouge")  ){
        console.log(transcript)
        fetch('/on-red');

        
        transcript = ""         
        readOut("la led est allumée")
    }
    if(transcript.includes("éteins la led rouge")  ){
        console.log(transcript)
        fetch('/off-red');
        transcript = ""         
        readOut("la led est eteinte")
    }
}

recognition.onend = function () {
 recognition.start();
}