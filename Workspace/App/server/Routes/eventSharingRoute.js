const eventSharingController = require('../Controllers/EventSharing/eventSharingController');
const middlewareController = require('../Controllers/Auth/middlewareController');
const route = require('express').Router();

route.get('/invites', middlewareController.verifyToken, eventSharingController.getEventInvites);
route.get('/responses', middlewareController.verifyToken, eventSharingController.getEventResponses);
route.get('/invites/:eventId', middlewareController.verifyToken, eventSharingController.getInvitedUsersByEvent);
route.post('/share', middlewareController.verifyToken, eventSharingController.shareEvents);
route.put('/accept-invite/:inviteId', middlewareController.verifyToken, eventSharingController.acceptInvite);
route.put('/decline-invite/:inviteId', middlewareController.verifyToken, eventSharingController.declineInvite);
route.put('/read/:inviteId', middlewareController.verifyToken, eventSharingController.setRead);
route.patch('/update-role', middlewareController.verifyToken, eventSharingController.updateRole);

module.exports = route;