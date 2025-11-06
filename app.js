const express = require('express');
const morgan = require('morgan');
const users = {
  'admin': 'password123',
  'john': 'mypass',
  'jane': 'secret'
};

// express app
const app = express();

// listen for requests
app.listen(3000);

// register view engine
app.set('view engine', 'ejs');


function checkLogin(username, password) {
  if (!users[username]) {
    return false;
  }
  if (users[username] !== password) {
    return false;
  }
  return true;
}

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

function authenticateUser(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  if (checkLogin(username, password)) {
    req.user = { username };
    console.log(`User ${username} authenticated successfully`);
    res.render ('protected', { title: 'Login-Needed page', user: req.user });
  } else {
    res.status(401).send('Invalid username or password');
  }
}

//urlencoded is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
//it reads form data from POST requests 
//it puts the data in req.body
app.use(express.urlencoded({ extended: true }));

app.post('/test', (req, res) => {
  console.log('Form data received:', req.body);
  res.send('Data logged to console');
});


app.get('/', (req, res) => {
  const blogs = [
    {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur'},
  ];
  res.render('index', { title: 'Home', blogs });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });

});
app.get('/profile', (req, res) => {
  res.render('profile', {title: 'Your Profile'});
});

app.get('/protected', authenticateUser, (req,res) => {
  res.render('protected', {title: 'Login-Needed page', user: req.user});
});

app.post('/login', authenticateUser, (req, res) => {
  res.send(`Welcome ${req.user.username}! you are now logged in.`);
});

// 404 page 
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
