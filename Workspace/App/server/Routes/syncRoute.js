const express = require('express');
const { syncGoogleCalendar, addEventToGoogleCalendar } = require('../Controllers/Event/syncController');
const { verifyToken } = require('../Controllers/Auth/middlewareController');

const router = express.Router();

router.post('/sync', verifyToken, syncGoogleCalendar);
router.post('/add-event', verifyToken, addEventToGoogleCalendar);

module.exports = router;
