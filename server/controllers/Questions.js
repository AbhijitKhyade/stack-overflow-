const mongoose = require('mongoose');
const Questions = require("../models/Questions");
const userModel = require('../models/userModel');
const stripe = require('stripe')(process.env.STRIP_SECRET_KEY);
// const nlp = require('compromise');
const askQuestionController = async (req, res) => {
    const postQuestionData = req.body;
    const postQuestion = new Questions(postQuestionData);
    console.log("asked que");
    try {
        // Save the question to the database
        await postQuestion.save();

        // Update the user's question counts
        const user = await userModel.findById(postQuestionData.userId);
        if (user) {
            console.log("update var...");
            user.questionsPostedToday -= 1;
            user.questionsPostedThisMonth += 1;
            await user.save();
            console.log("updated variable");
        }

        res.status(200).json({ message: "Posted a question successfully" });
    } catch (error) {
        console.log(error);
        res.status(409).json({ message: "Internal Server Error" });
    }
};

const getAllQuestionsController = async (req, res) => {
    try {
        const questionList = await Questions.find().limit(10);
        res.status(200).json(questionList);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

const deleteQuestionController = async (req, res) => {
    const { id: _id } = req.params;

    //check is it a valid mongodb id or not
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unavailable...");
    }

    try {
        await Questions.findByIdAndDelete(_id);
        res.status(200).json({ message: "Successfully deleted..." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const voteQuestionController = async (req, res) => {
    const { id: _id } = req.params;
    const { value, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unavailable...");
    }

    try {
        const question = await Questions.findById(_id);
        const upIndex = question.upVote.findIndex((id) => id === String(userId));
        const downIndex = question.downVote.findIndex((id) => id === String(userId));

        if (value === 'upVote') {
            if (downIndex !== -1) {
                question.downVote = question.downVote.filter((id) => id !== String(userId));
            }
            if (upIndex === -1) {
                question.upVote.push(userId);
            } else {
                question.upVote = question.upVote.filter((id) => id !== String(userId));
            }

        } else if (value === 'downVote') {
            if (upIndex !== -1) {
                question.upVote = question.upVote.filter((id) => id !== String(userId));
            }
            if (downIndex === -1) {
                question.downVote.push(userId);
            } else {
                question.downVote = question.downVote.filter((id) => id !== String(userId));
            }
        }
        await Questions.findByIdAndUpdate(_id, {
            $set: {
                upVote: question.upVote,
                downVote: question.downVote,
            }
        });
        res.status(200).json({ message: "voted successfully..." });
    } catch (error) {
        res.status(404).json({ message: "id not found" });
    }
}

// function getAnswer(question) {
//     // Use compromise to process the question and generate an answer
//     const doc = nlp(question);
//     // Customize this logic based on your use case
//     const answer = doc.sentences().out('text');
//     return answer;
// }
// const askOpenAIController = async (req, res) => {
//     const { question } = req.body;
//     console.log('Incoming Request Body:', req.body);

//     console.log(question);

//     // try {
//     //     const response = await axios.post(
//     //         'https://api.openai.com/v1/engines/davinci-codex/completions',
//     //         {
//     //             prompt: question,
//     //             max_tokens: 100,
//     //         },
//     //         {
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //                 'Authorization': 'Bearer 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',
//     //             },
//     //         }
//     //     );
//     //     console.log("entered");

//     //     const answer = response.data.choices[0]?.text || "No answer from OpenAI.";
//     //     console.log('answer:', answer);

//     //     res.json({ answer });
//     // } catch (error) {
//     //     res.status(500).json({ message: "Error while answering..." });
//     // }

//     try {
//         const { question } = req.body;
//         console.log('Incoming Request Body:', req.body);
//         console.log('Question:', question);

//         const answer = getAnswer(question);
//         console.log('Answer:', answer);

//         res.json({ answer });
//     } catch (error) {
//         console.error('Error while answering the question:', error.message);
//         res.status(500).json({ message: "Error while answering..." });
//     }
// }

const subscriptionController = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("userid in subscription", userId);

        // Assuming you have a User model with a subscription field
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // You should have the user's subscription information in the response
        res.status(200).json({ user: user });
    } catch (error) {
        console.error('Error fetching user subscription:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const paymentController = async (req, res) => {
    try {
        const { name, price, userId } = req.body;
        console.log(userId);
        const priceValue = parseFloat(price.replace(/[^\d.]/g, ''));
        // console.log("virtual:", priceValue);
        // console.log("name: ", name, " price:", price);
        const product = await stripe.products.create({
            name: name,
            type: 'service',
        });
        const minimumUnitAmount = 50;
        const unitAmount = Math.max(Math.round(priceValue * 1000000), minimumUnitAmount);
        const recurringPrice = await stripe.prices.create({
            product: product.id,
            recurring: {
                interval: 'month', // Set the interval for monthly subscription
            },
            unit_amount: Math.round(priceValue * 100), // Convert price to cents
            currency: 'inr',
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: recurringPrice.id,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `https://roaring-salmiakki-24cbae.netlify.app/payment-success`,
            cancel_url: `https://roaring-salmiakki-24cbae.netlify.app/payment-cancel`,
            // billing_address_collection: 'required',
            // shipping_address_collection: {
            //     allowed_countries: ['US', 'CA', 'GB', 'IN'], // Add other allowed countries as needed
            // },
        });

        // Update user's subscription information
        const user = await userModel.findById(userId);
        // console.log("in controller:", user);
        user.subscription = name; // Assuming plan name is Free, Silver, or Gold
        // console.log("subscription:", user.subscription);
        user.subscriptionStartDate = new Date();
        await user.save();
        // console.log("user data saved for subscription");


        res.status(200).json({ success: true, id: session.id });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = {
    askQuestionController,
    getAllQuestionsController,
    deleteQuestionController,
    voteQuestionController,
    subscriptionController,
    paymentController
};
