const eventSharingController = require('../Controllers/EventSharing/eventSharingController');
const middlewareController = require('../Controllers/Auth/middlewareController');
const route = require('express').Router();

route.get('/invites', middlewareController.verifyToken, eventSharingController.getEventInvites);
route.get('/shared-events/:id', eventSharingController.getSharedEvents);
route.post('/share', eventSharingController.shareEvents);
route.put('/accept-invite/:id', eventSharingController.acceptInvite);
route.put('/decline-invite/:id', eventSharingController.declineInvite);
route.put('/read/:eventId', middlewareController.verifyToken, eventSharingController.setRead);

module.exports = route;