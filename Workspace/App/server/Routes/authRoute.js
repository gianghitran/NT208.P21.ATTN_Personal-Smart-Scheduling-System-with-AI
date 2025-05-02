const middlewareController = require('../Controllers/Auth/middlewareController');
const authController = require('../Controllers/Auth/authController');
const route = require('express').Router();
const { verifyToken } = require('../Controllers/Auth/middlewareController');


route.post('/register', authController.registerUser);
route.post('/login', authController.loginUser);
route.post('/logout', authController.logoutUser);

route.post('/verify-email', authController.verifyEmail);

route.post('/forgot-password', authController.forgotPassword);
route.post('/reset-password/:token', authController.resetPassword);

route.post('/refresh', authController.requestRefreshToken);

route.post('/google-auth', authController.googleAuth);
route.get('/connect-google', authController.getGoogleOAuthURL);
route.post('/connect-google/callback', verifyToken, authController.googleOAuthCallback);


module.exports = route;