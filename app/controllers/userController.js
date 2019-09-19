import request from 'request';
import config from 'config';
import jwt from 'jsonwebtoken';;

import Responder from '../../lib/expressResponder';
import { User, Code } from '../models/index';
import auth from '../../config/google-util';

const jwtKey = 'my_secret_key';
const jwtExpirySeconds = 300;


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
    const authToken = req.headers.authorization;
    if (authToken){
      const token = extractToken(authToken);
      if (verifyToken(token)){
        const codeid = req.query.id;
        let list_of_usernames = req.body.usernames.split(',');
        Code.findOne({_id: codeid}, (err, docs) => {
          if (docs){
            docs.SharedWith = list_of_usernames;
            docs.save();
            res.send("Code Shared Successfully!");
          }
        });
      }
    }
  }

  static login(req, res) {
    if (req.session.user)
      res.send('Already logged In');
    else
      res.render('login');
  }

  static logout(req, res) {
    req.session.destroy(() => {
      res.render('editor');
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
          const token = jwt.sign({ username }, jwtKey, {
            algorithm: 'HS256', expiresIn: jwtExpirySeconds
          });
          req.session.user = user;
          res.render('editor', { req: req, token: token });
        }
      }
      else {
        res.send('Invalid Credentials!!');
      }
    });
  }

  static my_codes(req, res) {
    if (req.session.user) {      
      Code.find({ UserId: req.session.user._id }, (err, code) => {
        if(code){
          res.render('myCodes', {req: req, codes: code});
        }
        res.render('myCodes', {req: req, codes: null});
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
          res.send("Something went wrong!");
        }
      });
    }
  }

  static delete(req, res){
    const authToken = req.headers.authorization;
    if (authToken){
      const token = extractToken(authToken);
      if (verifyToken(token)){
        let codeid = req.query.id;
        Code.deleteOne({_id: codeid}, (err) => {
          if(err){
            res.send("Error while deleting the code!");
          }
        });
        res.send('Data deleted successfully!');
      }
    }
  }

  static show_all(req, res) {
    User.find((err, docs) => {
      if (!err) {
        res.render('showUsers', {
          list: docs
        });
      }
      else {
        res.send("Error loading users!");
      }
    });
  }

  static filterCode(req, res){
    const key = req.query.key;
    Code.findOne({_id: key}, (err, docs) => {
      if (!err){
        res.send(docs.Body);
      }
    });
  }

  static async compile(req, res) {
    
    const host = "https://api.jdoodle.com/v1/execute";
    const { language, body, stdin, codeid } = req.body;
    
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
        if (codeid){
          Code.findOne({_id: codeid}, (err, doc)=>{
            if (doc){
              doc.UserId=req.session.user._id;
              doc.Body=body; 
              doc.Language=language;
              doc.save();
            }
          });
        }
        else{
          let code = new Code();
          code.UserId=req.session.user._id;
          code.Body=body; 
          code.Language=language;
          code.save();
        }
      }
      res.send(result);
    }
    res.send("Please add some body in the editor to compile!");
  }

  static googleConsent(req, res){
    console.log(auth.urlGoogle());
    res.redirect(auth.urlGoogle());
  }

  static googleAuthRedirect(req, res){
    //log in the user with the provided info and then redirect the user to the editor page
    res.render('editor', {req: req});
  }
}

const verifyToken = (token) => {
  if (token){
    const { username, iat, exp } = jwt.verify(token, jwtKey);
    if (username && iat && exp){
      return true;
    }
    return false;
  }
  return false;
}

const extractToken = (string) => {
  return string.split(' ')[1];
}

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
      res.send('Error while registring the user!');
    }
  });
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
