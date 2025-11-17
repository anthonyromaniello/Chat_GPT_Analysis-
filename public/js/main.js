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


 //Da: Hash routing system

function renderPage(){
    const hash= window.location.hash || "#about";
    const content = document.getElementById("content");

    if (!content) return;

    //about page / indroduction/Profile Section
    if(hash==="#about"){
        content.innerHTML = `
        <section id="about">
            <h1>About page</h1>
            <p>Evaluate ChatGPT efficieny across domain.</p>
        </section>`;
    }

    //education page
    else if(hash==="#education"){
        content.innerHTML=`
        <section id="education">
            <h1>Education</h1>
            <p>Yorku-ITEC</p>
        </section>`
    }

    //experience page
    else if (hash==="#experience"){
        content.innerHTML=`
        <section id="experince">
            <h1>Experience</h1>
            <p>Web development, data analysis, Node.js projects.</p>
        </section>`
    }

    //project page
    else if (hash==="#project"){
        content.innerHTML=`
        <section id = "project">
            <h1>ChatGPT Efficiency Project</h1>
            
            <section>
                <h2>Research Approach</h2>
                <p>Node.js, MongoDB, WebSockets, and OpenAI API were used.</p>
            </section>

            <section>
                <h2>Dataset Overview</h2>
                <p>History, Social Science, and Computer Security.</p>
            </section>

            <!-- BACKEND HOOK: Middleware /api/add -->
            <section id="api-add-test">
                <h2>Test /api/add</h2>
                <input type="number" id="addA" placeholder="a" />
                <input type="number" id="addB" placeholder="b" />
                <button id="btnAdd">Calculate</button>
            <p id="addResult"></p>
            </section>

            <!-- BACKEND HOOK: Start Evaluation -->
            <section id="evaluation-control">
                <h2>Run ChatGPT Evaluation</h2>
                <button id="btnRunEval">Start Evaluation</button>
                <p id="evalStatus">Status: Idle</p>
            </section>

            <!-- VISUALIZATION HOOK -->
            <section id="results">
                <h2>Results</h2>
                <button id="btnLoadResults">Load Results</button>
                <canvas id="accuracyChart"></canvas>
                <canvas id="timeChart"></canvas>
            </section>

            <!-- WEBSOCKET HOOK -->
            <section id="ws-status">
                <h2>Live Updates</h2>
                <div id="wsMessages"></div>
            </section>
        </section>
        `;
        attachEvents();
    }
}

window.addEventListener("load",renderPage);
window.addEventListener("hashchange",renderPage);



//Da: Event Bindings
function attachEvents(){
    document.getElementById("btnAdd")?.addEventListener("click",async()=>{
        const a= document.getElementById("addA").value;
        const b = document.getElementById("addB").value;
        
        const res = await fetch(`/api/add?a=${a}&b=${b}`);
        const data = await res.json();

        document.getElementById("addResult").textContent =
      "Result: " + data.result;});
    

    //start evaluation
    document.getElementById("btnRunEval")?.addEventListener("click",()=>{
    if (window.porjectSpcket){
        porjectSpcket.send(JSON.stringify({type:"start-eval"}));
    }});

    //load results
    document.getElementById("btnLoadResults")?.addEventListener("click", async()=>{
        const res=await fetch ("/api/results");
        const data = await res.json();

        if (window.drawCharts){
            window.drawCharts(data);
        }else{
            console.log("Chart function not implemented yet.");
        }
    });

}


//Da: WebSocket Connection
let projectSocket;
function initWebSocket(){
    projectSocket = new WebSocket("ws://localhost:3000");

    projectSocket.onmessage = event =>{
        const box = document.getElementById("wsMessages");
        if(!box) return;
        box.innerHTML +=`<p>${event.data}</p>`;
    };
}

window.addEventListener("load", initWebSocket);