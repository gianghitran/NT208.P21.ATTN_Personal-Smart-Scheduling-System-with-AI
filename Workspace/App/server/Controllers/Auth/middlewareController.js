const jwt = require("jsonwebtoken");
const User = require("../../Models/User");

const middlewareController = {
    verifyToken: async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            console.log("Token received:", token);
            jwt.verify(token, process.env.ACCESS_KEY, async (err, decoded) => {
                if (err) {
                    console.log("❌ Token verify fail:", err);
                    return res.status(403).json("Token is not valid");
                }

                try {
                    const user = await User.findById(decoded.id);
                    console.log("Decoded user:", user);
                    if (!user) {
                        console.log("❌ User not found in DB");
                        return res.status(404).json("User not found");
                    }

                    req.user = user;
                    console.log("✅ User authenticated:", user.email); // 💥 in ra log
                    next();
                } catch (error) {
                    console.log("❌ Middleware DB error:", error);
                    return res.status(500).json("Internal server error");
                }
            });
        } else {
            console.log("❌ No authorization header found");
            return res.status(401).json("You are not authenticated");
        }
    },

    verifyUserAdmin: (req, res, next) => {
        if (req.user.admin || req.params.id === req.user.id) {
            next();
        }
        else {
            return res.status(403).json("You are not authorized to perform this action");
        }
    }
};

module.exports = middlewareController;