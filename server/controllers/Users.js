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

const updateBadgeCountController = async (req, res) => {
    // console.log('Before try block');
    try {
        // console.log("api hit");
        const { id: _id } = req.params;
        // Check if _id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const goldCount = await Question.aggregate([
            {
                $match: {
                    userId: _id,
                    $or: [
                        { 'upVote': { $exists: true, $not: { $size: 0 } } },
                        { 'downVote': { $exists: true, $not: { $size: 0 } } }
                    ]
                }
            },
            {
                $project: {
                    count: {
                        $add: [
                            { $cond: [{ $gte: [{ $size: '$upVote' }, 5] }, { $size: '$upVote' }, 0] },
                            { $cond: [{ $gte: [{ $size: '$downVote' }, 5] }, { $size: '$downVote' }, 0] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCount: { $sum: '$count' }
                }
            }
        ]);

        // Check if there are results and get the count
        const gold = goldCount.length > 0 ? goldCount[0].totalCount : 0;
        const silverCount = await Question.aggregate([
            {
                $unwind: "$answer" // unwind the answer array
            },
            {
                $match: {
                    "answer.userId": "65ccbf5ccabbc9acce70b16d" // match the userId
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 } // count the matched documents
                }
            }
        ])
        const bronzeCount = await Question.countDocuments({ userId: _id });
        silver = silverCount[0].count;
        // Update gold badge count and points
        let goldBadge = 0, silverBadge = 0, bronzeBadge = 0, goldPoints = 0, silverPoints = 0, bronzePoints = 0;
        if (gold >= 5 && gold != 0) {
            goldBadge = Math.floor(gold / 5);
            goldPoints = goldBadge * 10;
        }
        // Update silver badge count and points
        if (silver >= 4 && silver != 0) {
            silverBadge = Math.floor(silver / 4);
            silverPoints = silverBadge * 5;
        }
        // Update bronze badge count and points
        if (bronzeCount >= 3 && bronzeCount != 0) {
            // console.log("bronze");
            bronzeBadge = Math.floor(bronzeCount / 3);
            bronzePoints = bronzeBadge * 3;
        }
        // Update user document with badge counts and points
        await User.findByIdAndUpdate(_id, {
            $set: {
                'badges.gold.count': goldBadge,
                'badges.silver.count': silverBadge,
                'badges.bronze.count': bronzeBadge,
                'badges.gold.points': goldPoints,
                'badges.silver.points': silverPoints,
                'badges.bronze.points': bronzePoints,
            },
        });

        const user = await User.findById(_id);
        res.json({
            data: user
        });
    } catch (error) {
        console.error('Error updating badge counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = { getAllUsers, updateProfile, updateBadgeCountController };

