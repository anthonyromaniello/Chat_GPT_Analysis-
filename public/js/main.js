//Darrell: Dynamic Assistant

const tips = [
    "Hi, I am your project assistant.",
    "Evaluate ChatGPT efficieny across domain.",
    "Check the project tab for charts and results.",
    "We use Node.js, MongoDB, WebSockets, and the OpenAI API."
];

let tipIndex = 0;
 function rotateTips(){
    const el=document.getElementById("assistant-text");
    if(!el) return;
    el.textContent = tips[tipIndex];
    tipIndex = (tipIndex +1)%tips.length;
 }
 setInterval(rotateTips,4000);
 window.addEventListener("load",rotateTips);

