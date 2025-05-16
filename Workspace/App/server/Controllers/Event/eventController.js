const Event = require("../../Models/Event");
const EventSharing = require("../../Models/EventSharing");

const eventController = {
    createEvent: async (req, res) => {
        const newEvent = new Event({
            userId: req.user._id,
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            category: req.body.category,
            description: req.body.description
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
            const { userId } = req.query;
            if (!userId) return res.status(400).json({ message: "Missing userId" });
            const start = new Date(req.query.start);
            const end = new Date(req.query.end);
            if (start > end) {
                return res.status(400).json({ message: "startTime must be before endTime" });
            }

            const events = await Event.find({
                userId,
                start: { $gte: start, $lte: end },
                end: { $gte: start, $lte: end }
            });

            const sharedEventRef = await EventSharing.find({ inviteeId: userId }).populate("eventId");
            const sharedEventIds = sharedEventRef.map(event => event.eventId);
            const sharedEvents = await Event.find({
                _id: { $in: sharedEventIds },
                start: { $gte: start, $lte: end },
                end: { $gte: start, $lte: end }
            })

            const taggedEvents = events.map(event => ({
                ...event._doc,
                isShared: false
            }));

            const sharedTaggedEvents = sharedEvents.map(event => ({
                ...event._doc,
                isShared: true
            }));

            const allEvents = [...taggedEvents, ...sharedTaggedEvents];


            // const events = await Event.find({ userId });
            res.status(200).json(allEvents);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    updateEvent: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            if (event.userId.toString() === req.body.userId.toString()) {
                await event.updateOne({ $set: req.body });
                res.status(200).json({ message: "Event updated" });
            } else {
                res.status(403).json({ message: "You can only update your own events" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const event = await Event.findOneAndDelete({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!event) {
                return res.status(404).json({ message: "Event not found or not authorized" });
            }
            res.status(200).json({ message: "Event deleted" });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = eventController;