const jwt = require('jsonwebtoken');

const getDailyLimit = (subscription) => {
    return subscription === 'Free' ? 1 : subscription === 'Silver' ? 5 : Infinity;
};

const getMonthlyLimit = (subscription) => {
    return subscription === 'Free' ? 1 : subscription === 'Silver' ? 100 : Infinity;
};
const checkQuestionLimits = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        let decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData?.id;
        const user = req.userId;

        // Check daily limit
        if (user.subscription !== 'Gold' && user.questionsPostedToday >= getDailyLimit(user.subscription)) {
            return res.status(403).json({ error: 'Daily question limit exceeded.' });
        }

        // Check monthly limit
        if (user.subscription !== 'Gold' && user.questionsPostedThisMonth >= getMonthlyLimit(user.subscription)) {
            return res.status(403).json({ error: 'Monthly question limit exceeded.' });
        }

        next();
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = checkQuestionLimits;