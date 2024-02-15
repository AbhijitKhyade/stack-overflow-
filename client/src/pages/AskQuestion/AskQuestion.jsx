// components/AskQuestion.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { askQuestion } from "../../actions/question";
import axios from "axios";
import "./AskQuestion.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AskQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionTags, setQuestionTags] = useState("");
  const [todayQue, setTodayQue] = useState("");
  const [silverPlan, setSilverPlan] = useState("");
  const [goldPlan, setGoldPlan] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUserReducer);
  const BASE_URL = "https://stack-overflow-clone-2024.onrender.com";
  // const BASE_URL = "http://localhost:8080";
  //fetch user data
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/questions/subscription/${user?.result?._id}`
      );
      // console.log("fetched data: ", response?.data?.user);
      setTodayQue(response?.data?.user?.questionsPostedToday);
      setSilverPlan(response?.data?.user?.questionsPostedSilver);
      setGoldPlan(response?.data?.user?.questionsPostedGold);
      console.log(todayQue);
      if (todayQue === 0) {
        toast.warning("You already have asked 1 question today", {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        toast.warning("Please subscribe to ask more questions", {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    } catch (error) {
      console.error("Error fetching user subscription:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      try {
        if (!questionTitle || !questionBody || !questionTags) {
          // Display alerts for missing fields
          toast.warning("Please fill in all required fields", {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return;
        }


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
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message, {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      toast.warning("Login to post a question", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
          {todayQue === 0 && silverPlan === 0 && goldPlan === 0 ? (

            <>
              <p style={{ color: 'crimson' }}>You asked one question today , Subscribe to ask more questions</p>
              <Link to="/subscribe">
                <input
                  type="submit"
                  value="Subscribe for more questions"
                  className="review-btn"
                />
              </Link>
            </>
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
