import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import QuestionList from "./QuestionList";
import "./HomeMainBar.css";

const HomeMainBar = () => {
  const questionsList = useSelector((state) => state.questionsReducer);

  const location = useLocation();
  const user = useSelector((state) => state.currentUserReducer); // Assuming you have the user data in Redux state
  const navigate = useNavigate();

  const checkAuth = () => {
    if (!user) {
      alert("Please login to ask a question.");
      navigate("/Auth");
    } else {
      // Check if the user has a silver or gold subscription
      if (
        user?.result?.subscription === "Silver" ||
        user?.result?.subscription === "Gold"
      ) {
        // If the user has a valid subscription, proceed to ask the question
        navigate("/ask-question");
      } else {
        // If the user has a different subscription or no subscription, redirect to the subscribe page
        navigate("/subscribe");
      }
    }
  };

  return (
    <div className="main-bar">
      <div className="main-bar-header">
        {location.pathname === "/" ? (
          <h1>Top Questions</h1>
        ) : (
          <h1>All Questions</h1>
        )}
        <button onClick={checkAuth} className="ask-btn">
          Ask Question
        </button>
      </div>
      <div>
        {questionsList.data === null ? (
          <h1>Loading ...</h1>
        ) : (
          <>
            <p>{questionsList.data.length} questions</p>
            <QuestionList questionsList={questionsList.data} />
          </>
        )}
      </div>
    </div>
  );
};

export default HomeMainBar;
