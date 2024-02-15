import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import "./Subscribe.css";
import { useSelector } from "react-redux";


const Subscribe = () => {
  const User = useSelector((state) => state.currentUserReducer);
  const userId = User?.result?._id;
  const BASE_URL = "https://stack-overflow-clone-2024.onrender.com";
  // const BASE_URL = "http://localhost:8080";

  const plans = [
    {
      name: "Silver",
      price: "Rs. 1000 per year",
      description: "20 questions per day",
      plan_que: 20,
    },
    {
      name: "Gold",
      price: "Rs. 3000 per year",
      description: "50 Questions per day",
      plan_que: 50,
    },
  ];

  const [loading, setLoading] = useState(false); // Individual loading state for each plan

  const makePayment = async (plan, userId, index) => {
    setLoading(true); // Set loading state to true for the clicked plan
    const stripe = await loadStripe(
      "pk_test_51OaW4BSJ68wLt3sl9hV9cuE5huHVJZgpWzXHhVI4BqeApWbNE5ZDCqtYE7vzoetadfgjBEy2eQH0ustyenyXi1fi00OL7MI0iJ"
    );
    const apiurl = `${BASE_URL}/questions/payment/${userId}`;
    // console.log(apiurl);
    const response = await axios.post(apiurl, { userId, ...plan });
    // console.log("response", response);


    const session = response.data;

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
    setLoading(false); // Set loading state back to false after payment process completes
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
            <p>{plan.description}</p>
            <div className="btn">
              <button onClick={() => makePayment(plan, userId, index)} disabled={loading && loading === index}>
                {loading && loading === index ? 'Loading...' : 'Subscribe'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscribe;
