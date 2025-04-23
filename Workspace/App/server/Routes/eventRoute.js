const eventController = require("../Controllers/Event/eventController");
const middlewareController = require("../Controllers/Auth/middlewareController");
const route = require("express").Router();

route.post("/create", middlewareController.verifyToken, eventController.createEvent);
route.get("/get", eventController.getEvents);
route.put("/update/:id", middlewareController.verifyToken, eventController.updateEvent);
route.delete("/delete/:id", middlewareController.verifyToken ,eventController.deleteEvent);

module.exports = route;