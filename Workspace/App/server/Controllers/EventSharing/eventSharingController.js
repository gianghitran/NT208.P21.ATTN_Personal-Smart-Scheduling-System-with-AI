const EventSharing = require("../../Models/EventSharing");
const Event = require("../../Models/Event");
const User = require("../../Models/User");
const { sendEvent } = require("../../sse/sseService");

const eventSharingController = {
    getEventInvites: async (req, res) => {
        const userId = req.user.id;
        if (!userId) return res.status(400).json({ message: "Missing userId" });

        try {
            const invitesRaw = await EventSharing.find({ inviteeId: userId, hidden: false })
                .populate({ path: 'invitorId', select: 'full_name' })
                .populate({ path: 'eventId', select: 'title' })
                .populate({ path: 'ownerId', select: 'full_name' });

            // Map lại để thêm 2 trường mới
            const invites = invitesRaw.map(invite => ({
                ...invite.toObject(),
                invitorName: invite.invitorId?.full_name || null,
                eventName: invite.eventId?.title || null,
                ownerName: invite.ownerId?.full_name || null,
            }));

            return res.status(200).json( { invites } );
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getEventResponses: async (req, res) => {
        const userId = req.user.id;
        if (!userId) return res.status(400).json({ message: "Missing userId" });
        try {
            const responses = await EventSharing.find({ invitorId: userId, respondedAt: {$exists: true}, hidden: false })
                .populate({ path: 'inviteeId', select: 'full_name email' })
                .populate({ path: 'eventId', select: 'title' });

            // Map lại để thêm 2 trường mới
            const formattedResponses = responses.map(response => ({
                ...response.toObject(),
                inviteeName: response.inviteeId?.full_name || null,
                inviteeEmail: response.inviteeId?.email || null,
                eventName: response.eventId?.title || null,
            }));

            return res.status(200).json( { responses: formattedResponses } );
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getInvitedUsersByEvent: async (req, res) => {
        const eventId = req.params.eventId;
        const currentUserId = req.user.id;

        try {
            if (!eventId) return res.status(400).json({ message: "Missing eventId" });

            const event = await Event.findById(eventId).select("userId");

            if (!event) return res.status(404).json({ message: "Event not found" });

            const owner = await User.findById(event.userId);
            if (!owner) return res.status(404).json({ message: "Owner not found" });

            const ownerEmail = owner.email;
            
            if (currentUserId === event.userId.toString()) {
                const invitedUsers = await EventSharing.find({ eventId }).populate("inviteeId", "email");
                const formatedInvitedUsers = invitedUsers.map(user => ({
                    inviteeId: user.inviteeId._id,
                    email: user.inviteeId.email,
                    role: user.role,
                    status: user.status,
                    start: user.start,
                    end: user.end,
                }));
                return res.status(200).json({ ownerEmail, invitedUsers: formatedInvitedUsers, isOwner: true });
            }
            
            const currentUser = await EventSharing.findOne({ eventId, inviteeId: currentUserId }).populate("inviteeId", "email");
            if (!currentUser) return res.status(403).json({ message: "You are not invited to this event" });
            
            return res.status(200).json({ 
                ownerEmail,
                invitedUsers: [{
                    inviteeId: currentUser.inviteeId._id,
                    email: currentUser.inviteeId.email,
                    role: currentUser.role,
                    status: currentUser.status,
                    start: currentUser.start,
                    end: currentUser.end,
                }],
                isOwner: false, 
            });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },


    shareEvents: async (req, res) => {
        const invitorId = req.user.id;
        const { email, eventId } = req.body;

        const user = await User.findOne({ email });
        const event = await Event.findById(eventId);
        const owner = await User.findById(event.userId);

        if (!owner) return res.status(404).json({ message: "Owner not found" });

        if (!user) return res.status(404).json({ message: "User not found" });

        const inviteeId = user._id;

        if (invitorId.toString() === inviteeId.toString() || inviteeId.toString() === owner._id.toString()) {
            return res.status(400).json({ message: "You cannot share an event with yourself" });
        }

        if (!event) return res.status(404).json({ message: "Event not found" });
        
        try {
            const eventSharing = await EventSharing.findOne({ eventId, inviteeId: inviteeId });    
            if (eventSharing !== null) {    
                return res.status(409).json({ message: "Event already shared with this user" });
            }

            const newEventSharing = new EventSharing({
                eventId,
                inviteeId,
                invitorId,
                ownerId: owner._id,
                start: event.start,
                end: event.end
            });

            await newEventSharing.save();
            sendEvent(
                { type: "NOTIFICATION", data: {mode: "invite"} },
                inviteeId.toString(),
                null, 
            )
            return res.status(201).json({ message: "Event shared successfully", newEventSharing });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    acceptInvite: async (req, res) => {
        const { inviteId } = req.params;
        if (!inviteId) return res.status(400).json({ message: "Missing inviteId" });

        try {
            const invite = await EventSharing.findByIdAndUpdate(inviteId, { status: "accepted", respondedAt: Date.now() }, { new: true });
            if (!invite) return res.status(404).json({ message: "Invite not found" });
            sendEvent(
                { type: "NOTIFICATION" },
                invite.invitorId.toString(),
                null, 
            )
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
            if (!invite) return res.status(404).json({ message: "Invite not found" });
            sendEvent(
                { type: "NOTIFICATION" },
                invite.invitorId.toString(),
                null, 
            )
            res.status(200).json({ message: "Invite declined" });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    setRead: async (req, res) => {
        const { inviteId } = req.params;
        const { readType } = req.query; // hoặc req.body nếu bạn muốn gửi bằng POST

        if (!inviteId) return res.status(400).json({ message: "Missing inviteId" });

        // Xác thực trường hợp hợp lệ
        if (!["isRead", "isReadInvitor"].includes(readType)) {
            return res.status(400).json({ message: "Invalid read type" });
        }


        try {
            const update = { [readType]: true };
            const result = await EventSharing.findByIdAndUpdate(inviteId, update, { new: true });

            if (!result) {
            return res.status(404).json({ message: "Notification not found" });
            }

            return res.status(200).json({ message: "Marked as read", result });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    updateRole: async (req, res) => {
        const { updatedUser, eventId } = req.body;
        const ownerId = req.user.id;

        try {
            const eventSharing = await EventSharing.findOne({ inviteeId: updatedUser.inviteeId, eventId: eventId });
            if (ownerId.toString() !== eventSharing.ownerId.toString()) {
                return res.status(403).json({ message: "You are not authorized to update this user" });
            }

            eventSharing.role = updatedUser.role;
            await eventSharing.save();
            return res.status(200).json({ message: "User role updated successfully" });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

module.exports = eventSharingController;