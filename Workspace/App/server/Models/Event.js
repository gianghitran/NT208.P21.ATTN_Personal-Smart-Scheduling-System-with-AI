const mongoose = require("mongoose");
const { applyTimestamps } = require("./User");

const Event = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
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

        category: {
            type: String,
            required: true,
            enum: ["work", "school", "relax", "todo", "other"]
        },

        completed: {
            type: Boolean,
            default: false
        }
    }
);

module.exports = mongoose.model("Event", Event);