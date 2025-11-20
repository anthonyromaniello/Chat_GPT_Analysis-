//Darrell: Dynamic Assistant
//Anthony: Websocket Integration

const tips = [
    "Hi, I am your project assistant.",
    "Evaluate ChatGPT efficieny across domain.",
    "Check the project tab for charts and results.",
    "We use Node.js, MongoDB, WebSockets, and the OpenAI API."
];

let tipIndex = 0;
let tipInterval = null;

function rotateTips(){
    const el = document.getElementById("assistant-text");
    if(!el) return;
    
    // Fade out
    el.style.opacity = 0;
    
    // After fade completes, change text and fade in
    setTimeout(() => {
        el.textContent = tips[tipIndex];
        el.style.opacity = 1;
        tipIndex = (tipIndex + 1) % tips.length;
    }, 300);
}

// Initialize on page load
window.addEventListener("load", () => {
    rotateTips(); // Show first tip immediately
    if (tipInterval) clearInterval(tipInterval); // Clear any existing
    tipInterval = setInterval(rotateTips, 4000);
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
    if (tipInterval) clearInterval(tipInterval);
});

//WEBSOCKET CLIENT-SIDE

let projectSocket;

function initWebSocket() {
    projectSocket = new WebSocket('ws://localhost:3000');
    
    projectSocket.onopen = () => {
        console.log('Connected to WebSocket server');
        document.getElementById('wsStatus').textContent = 'Connected';
        document.getElementById('wsStatus').style.color = 'green';
    };
   
    projectSocket.onmessage = (event) => {
    // Runs when server sends you data
        const box = document.getElementById("wsMessages");
        if(!box) return;
        box.innerHTML += `<p>${event.data}</p>`;
    };

    projectSocket.onclose = () => {
        // Runs when connection closes
        console.log('WebSocket disconnected');
        document.getElementById('wsStatus').textContent = 'Disconnected';
        document.getElementById('wsStatus').style.color = 'red';
    };

    projectSocket.onerror = (error) => {
        // Runs when error occurs
        console.error('WebSocket error:', error);
    };
}
window.addEventListener('load', initWebSocket);


document.getElementById('wsSendBtn')?.addEventListener('click', () => {
    const input = document.getElementById('wsInput');
    const message = input.value;


    if (message.trim() && projectSocket && projectSocket.readyState === WebSocket.OPEN) {
        projectSocket.send(message);
        input.value = '';
        const box = document.getElementById('wsMessages');
        if (!box) return;
        box.innerHTML += `<p>${message}</p>`;
    }
})


//listen for, fetch, and display results of the calculation
document.getElementById('btnAdd')?.addEventListener('click', () => {
    const numA = document.getElementById('addA').value;
    const numB = document.getElementById('addB').value;

    const url = `/api/add?a=${numA}&b=${numB}`;
    fetch(url) 
        .then(response => response.json())
        .then(data => {
            const resultElement = document.getElementById('addResult');
            if (resultElement) {
                resultElement.textContent = `Result: ${data.result}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
})



