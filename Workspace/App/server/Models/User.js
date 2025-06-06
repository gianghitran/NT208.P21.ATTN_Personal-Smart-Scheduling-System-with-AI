const mongoose = require("mongoose");

const User = new mongoose.Schema(
{
    full_name: {
        type: String,
        trim: true,
        match: /^[A-ZÀ-Ỹa-zà-ỹ]+([ '-][A-ZÀ-Ỹa-zà-ỹ]+)*$/,
        minLength: 2,
        maxLength: 50,
        required: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },

    password: {
        type: String,
        minLength: 8,
        required: function () {
            return !this.oauth_provider;
        }
    },

    avatar: {
        type: String
    },

    oauth_provider: {
        type: String,
    },

    oauth_id: {
        type: String,
    },

    admin: {
        type: Boolean,
        default: false
    },

    googleAccessToken: {
        type: String,
    },
      googleRefreshToken: {
        type: String,
    },
    
    isVerified: {
        type: Boolean,
        default: false
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationToken: String,
    verificationTokenExpires: Date,

    lastAccess: {
        type: Date,
        default: Date.now
    },
},

{
    timestamps: true
} 
)

module.exports = mongoose.model("User", User); // Export the model