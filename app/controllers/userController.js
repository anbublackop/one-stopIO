import Responder from '../../lib/expressResponder';
import User from '../models/user';
import session from 'express-session';

export default class UserController {
  static page(req, res) {
    // getFromDB
    // .then(plans => Responder.success(res, plans))
    // .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
    res.send('This is index page');
  }

  static login(req, res) {
    if (req.session.user)
      res.render('protected_page');
    else
      res.render('login');
  }

  static logout(req, res) {
    req.session.destroy(() => {
      console.log("user logged out.")
    });
    res.render('login');
  }

  static loggingIn(req, res) {
    let { username, password } = req.body;
    User.findOne({ Username: username }, (err, user) => {
      if (user) {
        if (user.Password === password) {
          req.session.user = user;
          res.render('protected_page');
        }
      }
      else {
        console.log('Invalid Credentials!!');
      }
    });
  }

  static registration(req, res) {
    let { username, fullName, email, password } = req.body;
    if (!username || !password || !fullName || !email) {
      res.status("400");
      res.send("Invalid details!");
    }
    else {
      User.findOne({ Username: username }, (err, user) => {
        if (!err) {
          if (user) {
            console.log('Username not available! Please choose a different one');
          }
          else {
            insertRecord(res, username, fullName, email, password);
          }
        }
        else {
          console.log("Something went wrong!");
        }
      });
    }
  }

  static showALl(req, res) {
    User.find((err, docs) => {
      if (!err) {
        res.render('showUsers', {
          list: docs
        });
      }
      else {
        console.log("Error loading users!");
      }
    });
  }
}

const insertRecord = (res, username, fullName, email, password) => {
  let user = new User();
  user.Username = username;
  user.FullName = fullName;
  user.Email = email;
  user.Password = password;
  user.save((err, doc) => {
    if (!err) {
      res.redirect('/');
    }
    else {
      console.log('Error while registring the user!');
    }
  });
}
