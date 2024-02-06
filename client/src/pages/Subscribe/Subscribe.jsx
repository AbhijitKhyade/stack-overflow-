import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import "./Subscribe.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Subscribe = () => {
  const navigate = useNavigate();
  const User = useSelector((state) => state.currentUserReducer);
  const userId = User?.result?._id;
  // console.log(User);
  // console.log(User?.result?.subscription);

  const plans = [
    { name: "Silver", price: "Rs. 100 per month" },
    { name: "Gold", price: "Rs. 1000 per month" },
  ];

  const makePayment = async (plan, userId) => {
    // Check if the user already has a free subscription
    if (
      User?.result?.subscription === "Free" &&
      User?.result?.questionsPostedToday < 2
    ) {
      toast.success("You already have free plan");
      // If yes, navigate directly to AskQuestion page
      navigate("/AskQuestion");
      return;
    }
    // console.log("plan:", plan);
    const stripe = await loadStripe(
      "pk_test_51OaW4BSJ68wLt3sl9hV9cuE5huHVJZgpWzXHhVI4BqeApWbNE5ZDCqtYE7vzoetadfgjBEy2eQH0ustyenyXi1fi00OL7MI0iJ"
    );
    const apiurl = `http://localhost:8080/questions/payment/${userId}`;
    console.log(apiurl);
    const response = await axios.post(apiurl, { userId, ...plan });
    // console.log("response", response);

    const session = response.data;

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    toast.success(`You have subscribed for ${plan} subscription plan`);

    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <div className="subscribe-container">
      <div className="heading">
        <h1>Subscribe to get More doubts clear</h1>
      </div>
      <div className="cards">
        {plans.map((plan, index) => (
          <div className="subscribe-card" key={index}>
            <div className="head">
              <h2>{plan.name}</h2>
            </div>
            <p>{plan.price}</p>
            <div className="btn">
              <button onClick={() => makePayment(plan, userId)}>
                {plan.name === "Free"
                  ? "Subscribe and Ask 1 Question"
                  : "Subscribe"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscribe;
