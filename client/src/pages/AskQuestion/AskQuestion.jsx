// components/AskQuestion.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { askQuestion } from "../../actions/question";
import { updateProfile } from "../../actions/users";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./AskQuestion.css";

const AskQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionTags, setQuestionTags] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUserReducer);

  const fetchData = async () => {
    try {
    } catch (error) {
      console.error("Error fetching user subscription:", error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, [user, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      try {
        let maxQuestionsPerDay = 1; // Default to 1 question for free plan

        if (user.result.subscription === "Silver") {
          maxQuestionsPerDay = 10;
        } else if (user.result.subscription === "Gold") {
          maxQuestionsPerDay = 50;
        }

        console.log("Fetching user data...");
        const response = await axios.get(
          `https://stack-overflow-2024.onrender.com/questions/subscription/${user.result._id}`
        );

        if (response.status === 200) {
          const { questionsPostedToday } = response?.data?.user;

          if (questionsPostedToday >= maxQuestionsPerDay) {
            toast.error(
              `You have already asked ${maxQuestionsPerDay} questions today.`
            );
            toast.info(
              "Consider upgrading your subscription for more questions."
            );
            navigate("/subscribe");
            return;
          }
        }

        // Rest of the code remains the same

        await dispatch(
          askQuestion(
            {
              questionTitle,
              questionBody,
              questionTags,
              userPosted: user.result.name,
              userId: user.result._id,
            },
            navigate
          )
        );

        console.log("Question posted successfully.");
        toast.success("Question posted successfully.");
      } catch (error) {
        console.error(
          "Error posting question:",
          error.message || "Unknown error"
        );
        toast.error("Failed to post the question. Please try again.");
      }
    } else {
      toast.error("Login to post a question");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setQuestionBody(questionBody + "\n");
    }
  };

  return (
    <div className="ask-question">
      <div className="ask-ques-container">
        <h1>Ask a public Question</h1>
        <form onSubmit={handleSubmit}>
          <div className="ask-form-container">
            <label htmlFor="ask-ques-title">
              <h4>Title</h4>
              <p>
                Be specific and imagine you're asking a question to another
                person
              </p>
              <input
                type="text"
                id="ask-ques-title"
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                onChange={(e) => setQuestionTitle(e.target.value)}
              />
            </label>
            <label htmlFor="ask-ques-body">
              <h4>Body</h4>
              <p>
                Include all the information someone would need to answer your
                question
              </p>
              <textarea
                name=""
                id="ask-ques-body"
                cols="30"
                rows="10"
                onChange={(e) => setQuestionBody(e.target.value)}
                onKeyPress={handleEnter}
              ></textarea>
            </label>
            <label htmlFor="ask-ques-tags">
              <h4>Tags</h4>
              <p>Add up to 5 tags to describe what your question is about</p>
              <input
                type="text"
                id="ask-ques-tags"
                placeholder="e.g. (xml typescript wordpress)"
                onChange={(e) => {
                  setQuestionTags(e.target.value.split(" "));
                }}
              />
            </label>
          </div>
          {user?.result?.subscription === "Free" &&
          user?.result?.questionsPostedToday >= 1 ? (
            <Link to="/subscribe">
              <input
                type="submit"
                value="Subscribe for more questions"
                className="review-btn"
              />
            </Link>
          ) : (
            <input
              type="submit"
              value="Review your question"
              className="review-btn"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
