import Responder from '../../lib/expressResponder';
import { User, Code } from '../models/index';
import session from 'express-session';
import request from 'request';
import config from 'config'

export default class UserController {

  static page(req, res) {
    // getFromDB
    // .then(plans => Responder.success(res, plans))
    // .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
    // Responder.success(res, 'This is home page');
    res.render('editor', {req: req});
  }

  static share(req, res){
    console.log("Sharing...");
    let { usernames } = req.body;
    let list_of_usernames = usernames.split(',');
    
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

  static logging_in(req, res) {
    let { username, password } = req.body;
    User.findOne({ Username: username }, (err, user) => {
      if (user) {
        if (user.Password === password) {
          req.session.user = user;
          res.render('editor', {req: req});
        }
      }
      else {
        console.log('Invalid Credentials!!');
      }
    });
  }

  static my_codes(req, res) {
    if (req.session.user) {      
      Code.find({ UserId: req.session.user._id }, (err, code) => {
        if(code){
          res.render('myCodes', {req: req, codes: code});
        }
        else{
          res.render('myCodes', {req: req, codes: null});
        }
      });
    }
    else{
      res.send("You are not allowed to view this page!");
    }
  }

  static registration(req, res) {
    let { username, fullname, email, password } = req.body;
    if (!username || !password || !fullname || !email) {
      res.status("400");
      res.send("Invalid details!");
    }
    else {
      User.findOne({ Username: username }, (err, user) => {
        console.log(err,user);
        if (!err) {
          if (user) {
            res.status(405);
            res.send('Username not available! Please choose a different one');
          }
          else {
            insertUser(res, username, fullname, email, password);
            res.status(201);
            res.render('editor', {req: req});
          }
        }
        else {
          res.status(500);
          console.log("Something went wrong!");
        }
      });
    }
  }

  static delete(req, res){
    let codeid = req.query.id;
    Code.deleteOne({_id: codeid}, (err, docs) => {
      if(err){
        console.log("Error while deleting the code!");
      }
    });
    res.redirect('back');
  }

  static show_all(req, res) {
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
    if (body.trim()!==''){
      const data = {
        'clientSecret': config.jdoodleKeys.clientSecret,
        'clientId': config.jdoodleKeys.clientId,
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
  
      if (req.session.user){
        let code = new Code();
        code.UserId=req.session.user._id;
        code.Body=body; 
        code.Language=language;
        code.save((err, doc) => {
          if (!err) {
            console.log("Code saved successfully!")
          }
          else {
            console.log('Error while saving the code!');
          }
        });
      }
      res.send(result);
    }
    else{
      console.log("Please add some body in the editor to compile!");
    }
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

const insertUser = (res, username, fullname, email, password) => {
  let user = new User();
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
