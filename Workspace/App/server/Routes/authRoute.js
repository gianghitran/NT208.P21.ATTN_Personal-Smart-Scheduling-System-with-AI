const middlewareController = require('../Controllers/Auth/middlewareController');
const authController = require('../Controllers/Auth/authController');
const route = require('express').Router();

route.post('/register', authController.registerUser);
route.post('/login', authController.loginUser);
route.post('/logout', middlewareController.verifyToken, authController.logoutUser);
route.post('/refresh', authController.requestRefreshToken);

module.exports = route;