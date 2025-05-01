const User = require('../../Models/User');
const RefreshToken = require('../../Models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
const { sendVerificationEmail } = require('../../Utils/emails');

dotenv.config();

const clientID = process.env.GG_CLIENT_ID;
const client = new OAuth2Client(clientID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientID,
    });
    const payload = ticket.getPayload();
    return payload;
}

const authController = {
    registerUser: async (req, res) => {
        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userEmail = validator.isEmail(email);


        if (!full_name.match(/^[A-ZÀ-Ỹa-zà-ỹ]+([ '-][A-ZÀ-Ỹa-zà-ỹ]+)*$/)) {
            return res.status(400).json({ message: "Invalid full name" });
        }

        if (!userEmail) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            full_name: full_name,
            email: email,
            password: hashedPassword,
            verificationToken: verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        try {
            const user = await newUser.save();
            const { password, verificationToken, verificationTokenExpires, ...userData } = user._doc;
            await sendVerificationEmail(email, verificationToken);
            res.status(200).json(userData);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    logoutUser: async (req, res) => {
        try {

            await RefreshToken.deleteOne({ refreshToken: req.cookies.refresh_token });
            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: false,
            });
            return res.status(200).json({ message: "User logged out" });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    generateAccessToken: (user) => {
        const token = jwt.sign(
            {
                id: user._id,
                admin: user.admin
            },
            process.env.ACCESS_KEY,
            { expiresIn: "30s" }
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
            { expiresIn: "365d" }
        );
        return token;
    },

    googleAuth: async (req, res) => {
        try {
            const token = req.body.credential;
            const payload = await verify(token);
            const { email, name, sub } = payload;
            let account = await User.findOne({ email: email });

            if (account) {
                if (account.oauth_provider !== "google") {
                    return res.status(400).json({ message: "Email already exists" });
                }
            }
            else {
                const newUser = new User({
                    full_name: name,
                    email: email,
                    oauth_provider: "google",
                    oauth_id: sub
                });
                account = await newUser.save();
            }

            const access_token = authController.generateAccessToken(account);
            const refresh_token = authController.generateRefreshToken(account);
            RefreshToken.create({ userId: account._id, refreshToken: refresh_token });

            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            const { oauth_id, ...userData } = account._doc;
            res.status(200).json({ userData, access_token });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Please fill all the fields" });
            }

            const validUser = await User.findOne({ email: email });
            if (!validUser) {
                return res.status(400).json({ message: "Email not found" });
            };

            const validPassword = await bcrypt.compare(req.body.password, validUser.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Invalid password" });
            };

            if (validUser && validPassword) {
                const access_token = authController.generateAccessToken(validUser);
                const refresh_token = authController.generateRefreshToken(validUser);
                RefreshToken.create({ userId: validUser._id, refreshToken: refresh_token });

                res.cookie("refresh_token", refresh_token, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });

                const { password, admin, ...userData } = validUser._doc;
                res.status(200).json({ userData, access_token });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    verifyEmail: async (req, res) => {
        // 1 2 3 4 5 6
        const { code } = req.body;
        try {
            const user = await User.findOne({ 
                verificationToken: code,
                verificationTokenExpires: { $gt: Date.now() } 
            })

            if (!user) {
                return res.status(400).json({ message: "Invalid or expired token" });
            }

            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpires = undefined;
            await user.save();

            res.status(200).json({
                success: true,
                message: "Email verified successfully" ,
                user: {
                    ...user._doc,
                    admin: undefined,
                    password: undefined,
                },
            });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    requestRefreshToken: async (req, res) => {
        const token = req.cookies.refresh_token;
        if (!token) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const validToken = await RefreshToken.findOne({ refreshToken: token });
        if (!validToken) {
            return res.status(403).json({ message: "Refresh token is not valid" });
        }

        jwt.verify(token, process.env.REFRESH_KEY, async (error, user) => {
            if (error) {
                return res.status(403).json({ message: "Token is not valid" });
            }

            await RefreshToken.deleteOne({ refreshToken: token });

            const fixUser = {
                _id: user.id,
                admin: user.admin,
            };

            const newAccessToken = authController.generateAccessToken(fixUser);
            const newRefreshToken = authController.generateRefreshToken(fixUser);
            RefreshToken.create({ userId: user.id, refreshToken: newRefreshToken });
            res.cookie("refresh_token", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({ access_token: newAccessToken });
        });
    }
};

const { google } = require('googleapis');
const { admin } = require('googleapis/build/src/apis/admin');

authController.getGoogleOAuthURL = (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.VITE_GG_CLIENT_ID,
        process.env.GG_CLIENT_SECRET,
        process.env.GG_REDIRECT_URI
    );

    const scopes = ['https://www.googleapis.com/auth/calendar'];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
    });

    res.status(200).json({ url: authUrl });
};

authController.googleOAuthCallback = async (req, res) => {
    const { code } = req.body;

    const oauth2Client = new google.auth.OAuth2(
        process.env.VITE_GG_CLIENT_ID,
        process.env.GG_CLIENT_SECRET,
        process.env.GG_REDIRECT_URI
    );

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.googleAccessToken = tokens.access_token;
        user.googleRefreshToken = tokens.refresh_token;
        await user.save();

        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);

        await RefreshToken.create({ userId: user._id, refreshToken: newRefreshToken });

        res.cookie("refresh_token", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });

        const { password, ...userData } = user._doc;

        res.status(200).json({
            message: "Google Calendar connected!",
            userData,
            access_token: newAccessToken,
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to connect Google Calendar" });
    }
};


module.exports = authController;