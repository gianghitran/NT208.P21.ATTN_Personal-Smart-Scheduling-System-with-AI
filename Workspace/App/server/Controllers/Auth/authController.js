const User = require('../../Models/User');
const RefreshToken = require('../../Models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const cookieParser = require('cookie-parser');

const authController = {
    registerUser: async (req, res) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const userEmail = validator.isEmail(req.body.email);

        if (!userEmail) {
            return res.status(400).json({message: "Invalid email"});
        }

        const userExists = await User.findOne({email: req.body.email});
        if (userExists) {
            return res.status(400).json({message: "User already exists"});
        }

        const newUser = new User({
            full_name: req.body.full_name,
            email: req.body.email,
            password: hashedPassword
        });

        try {
            const user = await newUser.save();
            const {password, ...userData} = user._doc;
            res.status(200).json(userData);
        } catch (error) {
            res.status(500).json({ message: error });
        } 
    },

    generateAccessToken: (user) => {
        const token = jwt.sign(
            {
                id: user._id,
                admin: user.admin
            }, 
            process.env.ACCESS_KEY, 
            {expiresIn: "10s"}
        );
        return token;
    },

    generateRefreshToken: (user) => {
        const token = jwt.sign(
            {
                id: user._id,
                admin: user.admin
            }, 
            process.env.REFRESH_KEY, 
            {expiresIn: "60s"}
        );
        return token;
    },

    loginUser: async (req, res) => {
        try {
            const validUser = await User.findOne({email: req.body.email});
            if (!validUser) {
                return res.status(400).json({message: "User not found"});
            };

            const validPassword = await bcrypt.compare(req.body.password, validUser.password);
            if (!validPassword) {
                return res.status(400).json({message: "Invalid password"});
            };
            
            if (validUser && validPassword) {
                const access_token = authController.generateAccessToken(validUser);
                const refresh_token = authController.generateRefreshToken(validUser);
                RefreshToken.create({userId: validUser._id, refreshToken: refresh_token});

                res.cookie("refresh_token", refresh_token, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                
                const {password, admin, ...userData} = validUser._doc;
                res.status(200).json({userData, access_token});
            }
        } catch (error) {
            res.status(500).json({message: error});
        }
    },

    requestRefreshToken: async (req, res) => {
        // Check if refresh token exists in cookies
        const token = req.cookies.refresh_token;
        if (!token) {
            return res.status(401).json({message: "User not authenticated"});
        }

        // Check if refresh token is valid (of user)
        const validToken = await RefreshToken.findOne({refreshToken: token});
        if (!validToken) {
            return res.status(403).json({message: "Refresh token is not valid"});
        }

        // Verify refresh token
        jwt.verify(token, process.env.REFRESH_KEY, (error, user) => {
            if (error) {
                return res.status(403).json({message: "Token is not valid"});
            }

            // Delte old refresh token
            RefreshToken.deleteOne({refreshToken: token});

            // Generate new refresh token and access token; and save new refresh token
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            RefreshToken.create({userId: user.id, refreshToken: newRefreshToken});
            res.cookie("refresh_token", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({access_token: newAccessToken});
        });
    }
};

module.exports = authController; 