const mongoose = require("mongoose");

const RefreshToken = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        refreshToken: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now,
        }

    }
);

RefreshToken.index({createdAt: 1}, {expireAfterSeconds: 60 * 60 * 24 * 365}); // Set the expiration time of the token to 365 days

module.exports = mongoose.model("RefreshToken", RefreshToken); // Export the model