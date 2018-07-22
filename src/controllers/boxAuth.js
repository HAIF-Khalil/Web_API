import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;
import { findById,
findBySn} from './boxController';

var tokens = {}

const consumeRememberMeToken = (token, fn) =>{
  var uid = tokens[token];
  
  // invalidate the single-use token
  delete tokens[token];
  return fn(null, uid);
}

const saveRememberMeToken = (token, uid, fn) => {
  tokens[token] = uid;
  
  return fn();
}



// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.

export const passportSetup = (passport) => {
    passport.serializeUser( (user, done) => {
        done(null, user._id);
      });
      
      passport.deserializeUser( (_id, done) => {
        findById(_id,  (err, user) => {
          done(err, user);
        });
      });
 
      passport.use(new LocalStrategy(
        (username, password, done) => {
         
          process.nextTick( () =>{
      
            findBySn(username, (err, user) =>{
      
              if (err) { return done(err); }
              if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      
              if (user.password != password) { return done(null, false, { message: 'Invalid password' + username }); }
              return done(null, user);
            })
          });
        }
      ));
    
      passport.use(new RememberMeStrategy(
        (token, done) =>{
          consumeRememberMeToken(token, (err, uid) => {
            if (err) { return done(err); }
            if (!uid) { return done(null, false); }
      
            findById(uid, function(err, user) {
              if (err) { return done(err); }
              if (!user) { return done(null, false); }
              return done(null, user);
            });
          });
        },
        issueToken
      ));
      
};

const issueToken = (user, done) => {
  var token = randomString(64);
  saveRememberMeToken(token, user._id, (err) =>{
    if (err) { return done(err); }
    return done(null, token);
  });
};

const randomString = (len) => {
    var buf = []
      , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      , charlen = chars.length;
  
    for (var i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }
  
    return buf.join('');
  };
  
const getRandomInt = (min, max) =>{

    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  


export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
};