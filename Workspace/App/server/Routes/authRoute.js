const middlewareController = require('../Controllers/Auth/middlewareController');
const authController = require('../Controllers/Auth/authController');
const route = require('express').Router();
const { verifyToken } = require('../Controllers/Auth/middlewareController');


route.post('/register', authController.registerUser);
route.post('/login', authController.loginUser);
route.post('/logout', authController.logoutUser);
route.get('/user', verifyToken, authController.getUser);

// This route is used to verify otp reset password
route.post('/verify-email', authController.verifyEmail); 

// This route is used to verify email validation
route.post('/verify-email-validation', authController.verifyEmailValidation); 
route.post('/resend-verify-email', authController.resendVerifyEmail);

route.post('/forgot-password', authController.forgotPassword);
route.post('/reset-password/:token', authController.resetPassword);

route.post('/refresh', authController.requestRefreshToken);

route.post('/google-auth', authController.googleAuth);
route.get('/connect-google', authController.getGoogleOAuthURL);
route.post('/connect-google/callback', verifyToken, authController.googleOAuthCallback);


module.exports = route;