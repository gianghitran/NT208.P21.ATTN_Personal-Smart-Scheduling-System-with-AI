const jwt = require("jsonwebtoken");
const User = require("../../Models/User");

const middlewareController = {
    verifyToken: async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(" ")[1];

            jwt.verify(token, process.env.ACCESS_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Token is not valid" });
                }

                try {
                    const user = await User.findById(decoded.id);
                    if (!user) {
                        return res.status(404).json({ message: "User not found" });
                    }

                    req.user = user; 
                    next();
                } catch (error) {
                    return res.status(500).json({ message: "Internal server error" });
                }
            });
        } else {
            return res.status(401).json({ message: "You are not authenticated" });
        }
    },

    verifyUserAdmin: (req, res, next) => {
        if (req.user.admin || req.params.id === req.user.id) {
            next();
        } else {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
    }
};

module.exports = middlewareController;
