var express=require('express');
var router=express.Router();
var User=require('../models/user');

//Read userData
router.get('/',function(req,res,next){
  return res.SendFile(path.join(__dirname,'static/index.html'));
});

//POST route for updating userData

router.post('/', function(req,res,next){

  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    console.log('Password error');
    err.status = 400;
    res.render("passwords dont match");
  //  return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {
    console.log('no issue');
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        console.log('mongo issue');
        return next(error);
      } else {
        req.session.userId = user._id;
        console.log('sessiom');
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        console.log('Wrong email or password.');
        return next(err);
      } else {
        req.session.userId = user._id;
        console.log(' email or password.');
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    console.log('all fields');
    return next(err);
  }
});

// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        console.log('Wrong session.');
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          console.log('not authorised');
          err.status = 400;
          return next(err);
        } else {
          console.log(' authorised');
          return res.send('<h1>Name: </h1>' + User.username + '<h2>Mail: </h2>' + User.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
