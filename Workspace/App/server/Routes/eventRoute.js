const eventController = require("../Controllers/Event/eventController");
const route = require("express").Router();

route.post("/create", eventController.createEvent);
route.get("/get", eventController.getEvents);
route.put("/update/:id", eventController.updateEvent);
route.delete("/delete/:id", eventController.deleteEvent);

module.exports = route;