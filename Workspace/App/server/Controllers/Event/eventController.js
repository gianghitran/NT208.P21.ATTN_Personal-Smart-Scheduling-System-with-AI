const Event = require("../../Models/Event");
const EventSharing = require("../../Models/EventSharing");
const User = require("../../Models/User");
const { sendEvent } = require("../../sse/sseService");

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

            const sharedRefs = await EventSharing.find({}).select("eventId").lean();

            const sharedEventIdsByOwner = new Set(
                sharedRefs
                    .filter(ref => ref.eventId)
                    .map(ref => ref.eventId.toString())
            );

            const sharedEventRef = await EventSharing.find({ inviteeId: userId, status: "accepted" }).populate("eventId");
            const sharedEventIds = sharedEventRef.map(event => event.eventId);
            const sharedEvents = await Event.find({
                _id: { $in: sharedEventIds },
                start: { $lt: end },
                end: { $gt: start }
            })

            const ownerIds = [...new Set(sharedEvents.map(e => e.userId.toString()))];

            const owners = await User.find({ _id: { $in: ownerIds } }).select("full_name");
            const ownerMap = owners.reduce((acc, user) => {
                acc[user._id.toString()] = user.full_name;
                return acc;
            }, {});
            
            const taggedEvents = events.map(event => ({
                ...event._doc,
                isShared: sharedEventIdsByOwner.has(event._id.toString()),
            }));

            const sharedTaggedEvents = sharedEvents.map(event => ({
                ...event._doc,
                isShared: true,
                ownerName: ownerMap[event.userId.toString()] || "Unknown",
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
            const excludeClientId = req.headers['x-client-id'];
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            // Check if user is the owner of the event
            if (event.userId.toString() === req.user._id.toString()) {
                const newStart = new Date(req.body.start);
                const newEnd = new Date(req.body.end);

                await event.updateOne({ $set: req.body });
                
                // Lấy danh sách người được chia sẻ sự kiện
                const sharings = await EventSharing.find({ eventId: event._id });
                const inviteeIds = sharings.map(s => s.inviteeId.toString());

                // Gửi SSE cho chủ event và các invitee
                [event.userId.toString(), ...inviteeIds].forEach(userId => {
                    sendEvent(
                        { type: "EVENT_UPDATED", start: newStart, end: newEnd, data: req.body },
                        userId,
                        userId === req.user._id.toString() ? excludeClientId : null
                    );
                });

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
                const newTitle = req.body.title;
                const newStart = new Date(req.body.start);
                const newEnd = new Date(req.body.end);
                const newDescription = req.body.description;

                await event.updateOne({
                    $set: { title: newTitle, start: newStart, end: newEnd, description: newDescription }
                });

                // Lấy danh sách người được chia sẻ sự kiện
                const sharings = await EventSharing.find({ eventId: event._id });
                const inviteeIds = sharings.map(s => s.inviteeId.toString());

                // Gửi SSE cho chủ event và các invitee
                [event.userId.toString(), ...inviteeIds].forEach(userId => {
                    sendEvent(
                        { type: "EVENT_UPDATED", start: newStart, end: newEnd, data: req.body },
                        userId,
                        userId === req.user._id.toString() ? excludeClientId : null
                    );
                });

                // Invitee can update event
                return res.status(200).json({ message: "Shared event updated" });
            }
        } catch (error) {
            console.error("Error updating event:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            const excludeClientId = req.headers['x-client-id'];
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }


            if (event.userId.toString() === req.user._id.toString()) {
                const inviteeIds = (await EventSharing.find({ eventId: event._id }).distinct("inviteeId")).map(id => id.toString());
                await EventSharing.deleteMany({ eventId: event._id });
                await Event.deleteOne({ _id: req.params.id });
                inviteeIds.forEach(userId => {
                    sendEvent(
                        { type: "EVENT_DELETED", start: event.start, end: event.end, data: {eventId: event._id} },
                        userId,
                        userId === req.user._id.toString() ? excludeClientId : null
                    );
                });
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