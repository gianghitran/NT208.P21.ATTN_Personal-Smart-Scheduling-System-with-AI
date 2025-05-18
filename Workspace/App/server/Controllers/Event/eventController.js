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
                start: { $lt: end },
                end: { $gt: start }
            });

            const sharedEventRef = await EventSharing.find({ inviteeId: userId, status: "accepted" }).populate("eventId");
            const sharedEventIds = sharedEventRef.map(event => event.eventId);
            const sharedEvents = await Event.find({
                _id: { $in: sharedEventIds },
                start: { $lt: end },
                end: { $gt: start }
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

            // Check if user is the owner of the event
            if (event.userId.toString() === req.user._id.toString()) {
                await event.updateOne({ $set: req.body });
                return res.status(200).json({ message: "Event updated" });
            }

            // Check if user is an editor of the event
            const eventSharing = await EventSharing.findOne({ eventId: req.params.id, inviteeId: req.user._id });
            if (!eventSharing) {
                return res.status(403).json({ message: "You don't have permission to update this event" });
            }

            if (eventSharing.role !== "editor") {
                return res.status(403).json({ message: "You don't have permission to update this event" });
            }
            else {
                const { title, start, end, description } = req.body;
                await event.updateOne({
                    $set: { title, start, end, description }
                });
                // Invitee can update event
                return res.status(200).json({ message: "Shared event updated" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);

            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            if (event.userId.toString() === req.user._id.toString()) {
                await Event.deleteOne({ _id: event._id });
                await EventSharing.deleteMany({ eventId: event._id });
                return res.status(200).json({ message: "Event deleted successfully!" });
            }

            const sharing = await EventSharing.findOne({ eventId: req.params.id, inviteeId: req.user._id });

            if (sharing) {
                await EventSharing.deleteOne({ _id: sharing._id });
                return res.status(200).json({ message: "Shared event removed from your calendar." });
            }

            return res.status(403).json({ message: "You don't have permission to delete this event" });
        } catch (error) {
            console.error("Error deleting event:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = eventController;