var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
//var session=require('session');
const session = require('express-session');
const MongoSession = require('connect-mongo')(session);
//import connectMongo from 'connect-mongo';
//import session from 'express-session';
//var MongoSession=connectMongo (session);
//var MongoSession=require('connect-mongo')(session);

//Connecting to database
mongoose.connect('mongodb://localhost/test-app');
var db=mongoose.connection;
//error handling
db.on('error',console.error.bind(console,'connection error'));

db.once('open',function(){
  //db is connected
});

//using sessions to handle logins
app.use(session({
    secret:'anssjsjds',
    resave:true,
    saveUninitialized: false,
    store: new MongoSession({
      mongooseConnection:db
    
    })
}));

//parse incoming messages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false}));

//storing static files
app.use(express.static(__dirname+'/static'));

//includes routes
var routes=require('./routes/schema.js');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
