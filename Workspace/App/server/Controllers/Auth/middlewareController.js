const jwt = require("jsonwebtoken");

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.header.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.ACCESS_KEY, (err, user) => {
                if (err) {
                    res.status(403).json("Token is not valid");
                }

                req.user = user;
                next();
            })
        }
        else {
            return res.status(401).json("You are not authenticated");
        }
    },
};