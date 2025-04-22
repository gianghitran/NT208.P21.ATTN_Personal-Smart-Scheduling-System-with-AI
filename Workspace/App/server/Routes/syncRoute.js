const express = require('express');
const { syncGoogleCalendar, addEventToGoogleCalendar } = require('../Controllers/Event/syncController'); // Import đúng cách
const { verifyToken } = require('../Controllers/Auth/middlewareController');

console.log("syncGoogleCalendar:", syncGoogleCalendar);
console.log("addEventToGoogleCalendar:", addEventToGoogleCalendar);

const router = express.Router();

router.post('/sync', verifyToken, syncGoogleCalendar);
router.post('/add-event', verifyToken, addEventToGoogleCalendar);

module.exports = router;
