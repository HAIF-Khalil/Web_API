import { 
    addNewBox, 
    getBox,
    addDeviceData, 
    addDevice,
    getDeviceById
} from '../controllers/boxController';
import {ensureAuthenticated} from '../controllers/boxAuth';
import passport from 'passport';

const routes = (app) => {

    
    app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function(req, res) {
      res.redirect('/');
    }); 
    
    app.get('/logout', function(req, res){
        // clear the remember me cookie when logging out
        res.clearCookie('remember_me');
        req.logout();
        res.redirect('/');
      });

    app.get('/box',ensureAuthenticated,getBox);
    app.get('/box/device/:serial_number', ensureAuthenticated, getDeviceById);
    
    // POST endpoint
    app.post('/box',ensureAuthenticated,addNewBox);
    app.post('/box/device',ensureAuthenticated,addDevice);
    app.post('/box/device/record',ensureAuthenticated,addDeviceData);




}

export default routes;
