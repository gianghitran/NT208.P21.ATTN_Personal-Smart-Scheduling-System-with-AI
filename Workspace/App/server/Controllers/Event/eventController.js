const Event = require("../../Models/Event");

const eventController = {
    createEvent: async (req, res) => {
        const newEvent = new Event({
            userId: req.body.userId,
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            category: req.body.category
        });

        try {
            const event = await newEvent.save();
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    getEvents: async (req, res) => {
        try {
            const events = await Event.find({ userId: req.body.userId });
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    updateEvent: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (event.userId === req.body.userId) {
                await event.updateOne({ $set: req.body });
                res.status(200).json({ message: "Event updated" });
            } else {
                res.status(400).json({ message: "You can only update your own events" });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (event.userId === req.body.userId) {
                await event.deleteOne();
                res.status(200).json({ message: "Event deleted" });
            } else {
                res.status(400).json({ message: "You can only delete your own events" });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}

module.exports = eventController;