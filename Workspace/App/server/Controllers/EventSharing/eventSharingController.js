const EventSharing = require("../../Models/EventSharing");
const Event = require("../../Models/Event");

const eventSharingController = {
    getEventInvites: async (req, res) => {
        const userId = req.user.id;
        if (!userId) return res.status(400).json({ message: "Missing userId" });

        try {
            const invites = await EventSharing.find({ inviteeId: userId, hidden: false});

            return res.status(200).json( { invites } );
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // getSharedEvents: async (req, res) => {
    //     const { userId, startTime, endTime } = req.body;
    //     if (!startTime || !endTime) return res.status(400).json({ message: "Missing startTime or endTime" });
    //     if (new Date(startTime) > new Date(endTime)) {
    //         return res.status(400).json({ message: "startTime must be before endTime" });
    //     }
        
    //     if (!userId) return res.status(400).json({ message: "Missing userId" });

    //     try {
    //         const sharedEventRef = await EventSharing.find({ inviteeId: userId }).populate("eventId");
    //         const sharedEventIds = sharedEventRef.map(event => event.eventId);
    //         const sharedEvents = await Event.find({
    //             _id: { $in: sharedEventIds },
    //             $or: [
    //             {
    //                 startTime: { $gte: new Date(startTime), $lte: new Date(endTime) }
    //             },
    //             {
    //                 endTime: { $gte: new Date(startTime), $lte: new Date(endTime) }
    //             },
    //             {
    //                 startTime: { $lte: new Date(startTime) },
    //                 endTime: { $gte: new Date(endTime) }
    //             }
    //         ]
    //         });

    //         return res.status(200).json(sharedEvents);
    //     }
    //     catch (error) {
    //         return res.status(500).json({ message: error.message });
    //     }
    // },

    shareEvents: async (req, res) => {
        // const ownerId = req.ownerId;
        const { eventId, inviteeId, ownerId, ownerName, eventName, role} = req.body;

        if (ownerId === inviteeId) {
            return res.status(400).json({ message: "You cannot share an event with yourself" });
        }

        if (!eventId || !inviteeId || !role) return res.status(400).json({ message: "Missing eventId, userId or role" });
        try {
            const eventSharing = new EventSharing({
                eventId,
                inviteeId,
                ownerId,
                ownerName,
                eventName,
                role
            });
            await eventSharing.save();
            return res.status(201).json({ message: "Event shared successfully", eventSharing });
        }
        catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ message: "Event already shared with this user" });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    acceptInvite: async (req, res) => {
        const { inviteId } = req.params;
        if (!inviteId) return res.status(400).json({ message: "Missing inviteId" });

        try {
            const invite = await EventSharing.findByIdAndUpdate(inviteId, { status: "accepted", respondedAt: Date.now() }, { new: true });
            return res.status(200).json({ message: "Invite accepted" });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    declineInvite: async (req, res) => {
        const { inviteId } = req.params;
        if (!inviteId) return res.status(400).json({ message: "Missing inviteId" });

        try {
            const invite = await EventSharing.findByIdAndUpdate(inviteId, { status: "declined", respondedAt: Date.now() }, { new: true });
            res.status(200).json({ message: "Invite declined" });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    setRead: async (req, res) => {
        const { inviteId } = req.params;
        try{
            const result = await EventSharing.findByIdAndUpdate(inviteId, { isRead: true }, { new: true });
            if (!result) return res.status(404).json({ message: "Notification not found" });
            return res.status(204);
        }
        catch (error) {
            return res.status(500).json({message: error.message});
        }
    }
};

module.exports = eventSharingController;