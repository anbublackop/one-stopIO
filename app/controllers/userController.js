import Responder from '../../lib/expressResponder';
import { User, Code } from '../models/index';
import session from 'express-session';
import request from 'request';

export default class UserController {

  static page(req, res) {
    // getFromDB
    // .then(plans => Responder.success(res, plans))
    // .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
    // Responder.success(res, 'This is home page');
    res.render('editor');
  }

  static login(req, res) {
    if (req.session.user)
      res.send('Already logged In');
    else
      res.render('login');
  }

  static logout(req, res) {
    req.session.destroy(() => {
      console.log("user logged out.")
    });
    res.render('login');
  }

  static register(req, res) {
    if (req.session.user)
      res.send('This is home');
    else
      res.render('register');
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

  static myCodes(req, res) {
    userid = req.query.userid;
    if (req.session.user) {
      if (req.session.user.userid === userid) {
        res.send("Access granted to view the page!");
      }
      else {
        res.send("You are not allowed to view this page!");
      }
    }
    else {
      res.send("Please login to continue!");
    }
  }

  static registration(req, res) {
    let { username, fullname, email, password } = req.body;
    if (!username || !password || !fullname || !email) {
      res.status("400");
      res.send("Invalid details!");
    }
    else {
      console.log('Hello Console!!!!!!!!!!!!'); 
      User.find((err, docs) => {
        if (!err) {
          console.log(docs);
        }
        else {
          console.log("Error loading users!");
        }
      });
      
      User.findOne({ Username: username }, (err, user) => {
        if (!err) {
          if (user) {
            console.log('Username not available! Please choose a different one');
            res.status(405);
          }
          else {
            insertRecord(res, username, fullname, email, password);
            res.status(201);
          }
        }
        else {
          res.status(500);
          console.log("Something went wrong!");
        }
      });
    }
  }

  static showAll(req, res) {
    console.log(User);
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

  static async compile(req, res) {
  
    const host = "https://api.jdoodle.com/v1/execute";
    const { language, body, stdin } = req.body;
    console.log(req.body);
    const data = {
      'clientSecret': '4a941cc902adaca23c1e67330856b697726c68f84c5a88ccd1bf5c4cb7568ea3',
      'clientId': 'ac4680b2f667cd4864a60e9d5cd4d18f',
      'script': body,
      'stdin': stdin,
      'language': language,
      'versionIndex': '0'
    }
    function responseFunction() {
      return new Promise((resolve, reject) => {
        request.post(host, { json: data }, (error, res, body) => {
          if (error) {
            reject(error);
          }
          resolve(body);
        });
      });
    }

  const result = await responseFunction();
  res.send(result);
  }
}

// async function basicAuth(req, res, next) {
//   // make authenticate path public
//   if (req.path === '/users/authenticate') {
//     return next();
//   }

//   // check for basic auth header
//   if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
//     return res.status(401).json({ message: 'Missing Authorization Header' });
//   }

//   // verify auth credentials
//   const base64Credentials =  req.headers.authorization.split(' ')[1];
//   const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//   const [username, password] = credentials.split(':');
//   const user = await userService.authenticate({ username, password });
//   if (!user) {
//     return res.status(401).json({ message: 'Invalid Authentication Credentials' });
//   }

//   // attach user to request object
//   req.user = user

//   next();
// }

const insertRecord = (res, username, fullname, email, password) => {
  let user = new User();
  // user.Id = user._id;
  user.Username = username;
  user.FullName = fullname;
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
