const jwt = require("jsonwebtoken");

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid");
                }

                req.user = user;
                next();
            })
        }
        else {
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