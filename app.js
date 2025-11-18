//Express Server-side code -Anthony

const express = require('express');
const morgan = require('morgan');
const http = require('http');
const WebSocket = require('ws')

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ', req.path);
  console.log('method: ', req.method);
  next();
});

app.use((req, res, next) => {
  console.log('in the next middleware');
  next();
});

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

//urlencoded is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
//it reads form data from POST requests 
//it puts the data in req.body
app.use(express.urlencoded({ extended: true }));

app.post('/test', (req, res) => {
  console.log('Form data received:', req.body);
  res.send('Data logged to console');
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/education', (req, res) => {
  res.render('education', { title: 'Education' });
});

app.get('/experience', (req, res) => {
  res.render('experience', { title: 'Experience' });
});

app.get('/project', (req, res) => {
  res.render('project', { title: 'Project' });
});

app.get('/api/add', (req, res,) => {

  if (!req.query.a || !req.query.b) {
    return res.status(400).json({ error: "Both a and b are required" });
  }
  let numA = parseInt(req.query.a);
  let numB = parseInt(req.query.b);

  let result = numA + numB;
  res.json({"result" : result});

})

// 404 page 
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});


const server = http.createServer(app);
const ww = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('client connnected');
  ws.on('message', function (data) {
    console.log('Received', data.toString())

    //echo back to client
    ws.send('Server received: ${data}');
  })
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log("Initializing Websocket");

// listen for requests
app.listen(3000);