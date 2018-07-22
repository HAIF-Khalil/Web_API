import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './src/routes/boxRoute';
import passport from 'passport';
import flash from 'connect-flash';
/*const LocalStrategy = require('passport-local').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;*/
import session from 'express-session';
var MongoStore = require('connect-mongo')(session);
import { passportSetup } from './src/controllers/boxAuth';



const app = express();  
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/SmartHome');

// bodyparser setup
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.session({
    secret:'condor smart home ict 2018',
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore(
   {mongooseConnection:mongoose.connection}
    )
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(passport.authenticate('remember-me'));
//app.use(express.methodOverride());
passportSetup(passport);
app.use(function(req,res,next){
    var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});
app.use(app.router);

routes(app);

// serving static files
//app.use(express.static('public'));

app.get('/', (req, res) =>
    res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () =>
    console.log(`your server is running on port ${PORT}`)
);