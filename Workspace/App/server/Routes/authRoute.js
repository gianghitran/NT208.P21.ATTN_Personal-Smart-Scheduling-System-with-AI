const middlewareController = require('../Controllers/Auth/middlewareController');
const authController = require('../Controllers/Auth/authController');
const route = require('express').Router();

route.post('/register', authController.registerUser);
route.post('/login', authController.loginUser);
route.post('/logout', authController.logoutUser);

module.exports = route;