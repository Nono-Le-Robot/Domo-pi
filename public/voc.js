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
    if(transcript.includes("led on")  ){
        console.log(transcript)
        fetch('/on');

        
        transcript = ""         
        readOut("la led est allumée")
    }
    if(transcript.includes("led off")  ){
        console.log(transcript)
        fetch('/off');
        transcript = ""         
        readOut("la led est eteinte")
    }
}

recognition.onend = function () {
 recognition.start();
}