const eventSharingController = require('../Controllers/EventSharing/eventSharingController');
const middlewareController = require('../Controllers/Auth/middlewareController');
const route = require('express').Router();

route.get('/invites', middlewareController.verifyToken, eventSharingController.getEventInvites);
// route.get('/shared-events', eventSharingController.getSharedEvents);
route.post('/share', eventSharingController.shareEvents);
route.put('/accept-invite/:inviteId', middlewareController.verifyToken, eventSharingController.acceptInvite);
route.put('/decline-invite/:inviteId', middlewareController.verifyToken, eventSharingController.declineInvite);
route.put('/read/:inviteId', middlewareController.verifyToken, eventSharingController.setRead);

module.exports = route;