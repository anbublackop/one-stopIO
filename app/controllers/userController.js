import request from 'request';
import config from 'config';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';

import { User, Code } from '../models/index';
import auth from '../../lib/google-util';

const jwtKey = 'my_secret_key';
const jwtExpirySeconds =  Math.floor(Date.now() / 1000) + (60 * 60);


export default class UserController {

  static page(req, res) {
    res.render('editor', {req: req});
  }

  static login(req, res) {
    if (req.session.user)
      res.render('editor', {req: req});
    res.render('login');
  }

  static logout(req, res) {
    req.session.destroy(() => {
      res.render('editor');
    });
  }

  static register(req, res) {
    if (req.session.user)
      res.render('editor', {req: req});
    res.render('register');
  }
 
  static createLogin(req, res) {
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
      if(err) {
        res.send('Invalid Credentials!!');
      }
    });
  }

  static share(req, res){
    console.log("Sharing...");
    const authToken = req.headers.authorization;
    if (authToken){
      const token = extractToken(authToken);
      if (verifyToken(token)){
        const codeid = req.query.id;
        let list_of_usernames = req.body.usernames.split(',').map(item => item.trim());
        Code.findOne({_id: codeid}, (err, docs) => {
          if (docs){
            const allUsers = Array.from(docs.SharedWith).concat(list_of_usernames);
            const updatedList = new Set(allUsers);
            docs.SharedWith = Array.from(updatedList);
            docs.save();
            res.send("Code Shared Successfully!");
          }
        });
      }
    }
  }

  static shared(req, res){
    const username = req.session.user.Username;
    Code.find({ SharedWith: { "$in" : [username] }  }, (err, docs) => {
      if (docs){
        res.render('sharedWithMe', {req: req, codes: docs});
      }
      res.render('sharedWithMe', {req: req, codes: null});
    });
  }

  static fetchCodes(req, res) {
    if (req.session.user){      
      Code.find({ UserId: req.session.user._id }, (err, code) => {
        if(code){
          res.render('myCodes', {req: req, codes: code});
        }
        res.render('myCodes', {req: req, codes: null});
      });
    }
    if(!req.session.user){
      res.send("You are not allowed to view this page!");
    }
  }

  static createUser(req, res){
    let { username, fullname, email, password } = req.body;
    if (!username || !password || !fullname || !email) {
      res.send("Invalid details!");
    }
    if (username && password && fullname && email) {
      User.findOne({ Username: username }, (err, user) => {
        if (!err) {
          if (user) {
            res.send('Username not available! Please choose a different one');
          }
          else {
            insertUser(res, username, fullname, email, password);
            res.render('editor', {req: req});
          }
        }
        if (err) {
          res.send("Something went wrong!");
        }
      });
    }
  }

  static deleteRecord(req, res){
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

  static getCode(req, res){
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
      insertCode(req, codeid, body, language);
      res.send(result);
    }
    res.send("Please add some body in the editor to compile!");
  }

  static googleConsent(req, res){
    res.redirect(auth.urlGoogle());
  }

  static async getProfile(req, res){
    const code = req.query.code;
    const { id, email, fullname, tokens } = await fetchUserInfo(code);
    User.findOne({ GoogleId: id }, (err, doc) => {
      if (doc) {
          req.session.user = doc;
          res.render('editor', { req: req });
      }
      if (!doc){
        let user = new User();
        user.GoogleId = id;
        user.Email = email;
        user.FullName = email;
        user.save();
        req.session.user = user;
        res.render('editor', { req: req });
      }
    });
  }
}

function getGooglePlusApi(auth) {
  return google.plus({ version: 'v1', auth });
}

async function fetchUserInfo(code){
  //log in the user with the provided info and then redirect the user to the editor page
  
  const aut = auth.createConnection();
  const data = await aut.getToken(code);
  const tokens = data.tokens;
  console.log(tokens);

  // add the tokens to the google api so we have access to the account
  aut.setCredentials(tokens);
  
  // connect to google plus - need this to get the user's email
  const plus = getGooglePlusApi(aut);
  const me = await plus.people.get({ userId: 'me' });

  // get the google id and email
  const userGoogleId = me.data.id;
  const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
  const fullName = me.data.fullName;
  
  // return so we can login or sign up the user
  return {
        id: userGoogleId,
        fullname: fullName,
        email: userGoogleEmail,
        tokens: tokens
      };
}

const verifyToken = (token) => {
  if (token){
    const { username, iat, exp } = jwt.verify(token, jwtKey);
    if (username && iat && exp){
      return true;
    }
  }
  return false;
}

const extractToken = (string) => {
  return string.split(' ')[1];
}

const insertCode = (req, codeid, body, language) => {
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
    if (!codeid){
      let code = new Code();
      code.UserId=req.session.user._id;
      code.Body=body; 
      code.Language=language;
      code.save();
    }
  }
  return;
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
    res.send('Error while registring the user!');
  });
}
