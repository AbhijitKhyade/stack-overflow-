const mongoose = require("mongoose");
const Questions = require("../models/Questions");
const userModel = require("../models/userModel");
const stripe = require("stripe")(
  "sk_test_51OaW4BSJ68wLt3slvOhD4XVgKhxPCSbhBbs9uBWYDENlAEpRWay8FEnQ1OdNY23zIBjHFLtZfDP9fiiYDQEwqQsK00WwxMMhl2"
);
// const nlp = require('compromise');
const askQuestionController = async (req, res) => {
  const postQuestionData = req.body;
  const postQuestion = new Questions(postQuestionData);
  // console.log("asked que by :", postQuestionData?.userId);
  try {
    // Save the question to the database
    await postQuestion.save();

    // Update the user's question counts
    const user = await userModel.findById(postQuestionData.userId);
    if (user) {
      console.log("update user...");
      if (user.questionsPostedToday === 1) {
        console.log("today");
        user.questionsPostedToday = 0;
      }
      if (user.subscription === "Silver") {
        console.log("silver");
        user.questionsPostedSilver -= 1;
      }
      if (user.subscription === "Gold") {
        console.log("gold");
        user.questionsPostedGold -= 1;
      }

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
    const questionList = await Questions.find();
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
    const downIndex = question.downVote.findIndex(
      (id) => id === String(userId)
    );

    if (value === "upVote") {
      if (downIndex !== -1) {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
      if (upIndex === -1) {
        question.upVote.push(userId);
      } else {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
      if (downIndex === -1) {
        question.downVote.push(userId);
      } else {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
    }
    await Questions.findByIdAndUpdate(_id, {
      $set: {
        upVote: question.upVote,
        downVote: question.downVote,
      },
    });
    res.status(200).json({ message: "voted successfully..." });
  } catch (error) {
    res.status(404).json({ message: "id not found" });
  }
};


const subscriptionController = async (req, res) => {
  try {

    const { userId } = req.params;
    console.log("userid in subscription", userId);

    // Assuming you have a User model with a subscription field
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // You should have the user's subscription information in the response
    res.status(200).json({ user: user });
  } catch (error) {
    console.error("Error fetching user subscription:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const paymentController = async (req, res) => {
  try {
    const { name, price, userId, plan_que } = req.body;

    const priceValue = parseFloat(price.replace(/[^\d.]/g, ""));
    const product = await stripe.products.create({
      name: name,
      type: "service",
    });
    const minimumUnitAmount = 50;
    const unitAmount = Math.max(
      Math.round(priceValue * 1000000),
      minimumUnitAmount
    );
    const recurringPrice = await stripe.prices.create({
      product: product.id,
      recurring: {
        interval: "year", // Set the interval for monthly subscription
      },
      unit_amount: Math.round(priceValue * 100), // Convert price to cents
      currency: "inr",
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: recurringPrice.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `https://stack-overflow-1728.vercel.app/payment-success`,
      // success_url: `http://localhost:3000/payment-success`,
      cancel_url: `https://stack-overflow-1728.vercel.app/payment-cancel`,
      // cancel_url: `http://localhost:3000/payment-cancel`,
      // billing_address_collection: 'required',
      // shipping_address_collection: {
      //   allowed_countries: ['US', 'CA', 'GB', 'IN'], // Add other allowed countries as needed
      // },
    });
    // console.log("Session:", session);

    
    try {
      // Update user's subscription plan
      await updateUserPlanController({
        body: {
          name,
          plan_que,
          userId,
        },
      });
    } catch (error) {
      console.error("Error updating user plan:", error.message);
      throw new Error("Failed to update user plan.");
    }

    res.status(200).json({ success: true, id: session.id });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserPlanController = async (req) => {
  try {
    const { name, plan_que, userId } = req.body;
    // console.log(plan_que);

    // Ensure userModel is properly imported
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    // Update user subscription and questionsPosted based on the plan
    user.subscription = name;
    name === "Silver" ? (user.questionsPostedSilver += plan_que) : (user.questionsPostedGold += plan_que);
    user.subscriptionStartDate = new Date();
    await user.save();

    // Return a success message
    return { success: true, message: "Subscription plan updated successfully." };
  } catch (error) {
    console.error("Error updating subscription:", error.message);
    throw new Error("Failed to update subscription.");
  }
};



module.exports = {
  askQuestionController,
  getAllQuestionsController,
  deleteQuestionController,
  voteQuestionController,
  subscriptionController,
  paymentController,
  updateUserPlanController
};
