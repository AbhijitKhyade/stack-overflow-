const mongoose = require('mongoose');
const User = require('../models/userModel');
const Question = require("../models/Questions");

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        const allUserDetails = [];
        allUsers.forEach((users) => {
            allUserDetails.push({ _id: users._id, name: users.name, about: users.about, tags: users.tags, joinedOn: users.joinedOn });
        });
        res.status(200).json(allUserDetails);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { id: _id } = req.params;
    const { name, about, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unavailable...");
    }

    try {
        const updatedProfile = await User.findByIdAndUpdate(_id, { $set: { 'name': name, 'about': about, 'tags': tags } }, { new: true });
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(405).json({ message: error.message });
    }
}
let goldBadge = 0, silverBadge = 0, bronzeBadge = 0, goldPoints = 0, silverPoints = 0, bronzePoints = 0;

const updateBadgeCountController = async (req, res) => {

    // console.log('Before try block');
    try {
        console.log("api hit");
        const { userId } = req.body;
        console.log(userId);
        const goldCount = await Question.countDocuments({ userId, 'upVote.length': { $gt: 5 } });
        const silverCount = await Question.countDocuments({ 'answer.userId': userId });
        const bronzeCount = await Question.countDocuments({ userId });
        console.log(`User ${userId} has asked ${bronzeCount} questions.`);
        console.log(`User ${userId} has answered ${silverCount} questions.`);
        console.log(`User ${userId} has voted ${goldCount} questions.`);
        // console.log("before", goldCount, silverCount, bronzeCount);

        // Update gold badge count and points
        if (goldCount >= 5 && goldCount != 0) {
            goldBadge = Math.floor(goldCount / 5);
            goldPoints = goldBadge * 10;
        }

        // Update silver badge count and points
        if (silverCount >= 4 && silverCount != 0) {
            silverBadge = Math.floor(silverCount / 4);
            silverPoints = silverBadge * 5;
        }

        // Update bronze badge count and points
        if (bronzeCount >= 3 && bronzeCount != 0) {
            console.log("bronze");
            bronzeBadge = Math.floor(bronzeCount / 3);
            bronzePoints = bronzeBadge * 3;
        }

        console.log("after", goldBadge, silverBadge, bronzeBadge);
        console.log("points", goldPoints, silverPoints, bronzePoints);

        await User.findByIdAndUpdate(userId, {
            $set: {
                'badges.gold.count': goldBadge,
                'badges.silver.count': silverBadge,
                'badges.bronze.count': bronzeBadge,
                'badges.gold.points': goldPoints,
                'badges.silver.points': silverPoints,
                'badges.bronze.points': bronzePoints,
            },
        });

        res.json({
            goldBadge,
            silverBadge,
            bronzeBadge,
            goldPoints,
            silverPoints,
            bronzePoints,
        });
    } catch (error) {
        console.error('Error updating badge counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = { getAllUsers, updateProfile, updateBadgeCountController };

