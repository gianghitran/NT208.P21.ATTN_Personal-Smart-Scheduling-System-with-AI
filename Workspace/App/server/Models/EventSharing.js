const mongoose = require("mongoose");

const EventSharingSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    inviteeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    invitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    start: {
        type: Date,
        required: true
    },

    end: {
        type: Date,
        required: true
    },

    role: {
        type: String,
        enum: ["viewer", "editor"],
        default: "viewer"
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending"
    },

    isRead: {
        type: Boolean,
        default: false
    },

    isReadInvitor: {
        type: Boolean,
        default: false
    },

    hidden: {
        type: Boolean,
        default: false
    },

    invitedAt: {
        type: Date,
        default: Date.now
    },

    respondedAt: {
        type: Date
    }
}, { timestamps: true });

EventSharingSchema.index({ eventId: 1, inviteeId: 1 }, { unique: true });
module.exports = mongoose.model("EventSharing", EventSharingSchema);