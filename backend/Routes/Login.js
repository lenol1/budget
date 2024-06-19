const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../Models/User");
const {save_objectId} = require('../storage/get_setObject');

router.post("/", async (req, res) => {
    const { login, password, googleData } = req.body; 
    try {
        let user;
        if (googleData) {
            user = await User.findOne({ email: googleData.email });
            if (!user) {
                const newUser = new User({
                    username: googleData.name,
                    email: googleData.email,
                    password: "", 
                });
                user = await newUser.save();
            }
            save_objectId(user.id);
            return res.status(200).json({ message: "Login successful" });
        } else if (googleData === null) {
            user = await User.findOne({
                $or: [
                { email: login },
                { username: login } ]
            });
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: "Invalid password" });
            }
            save_objectId(user.id);
            res.status(200).json({ message: "Login successful" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;