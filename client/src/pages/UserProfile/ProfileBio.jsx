import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const ProfileBio = ({ currentProfile }) => {
  const currentUser = useSelector((state) => state.currentUserReducer);
  // console.log("Currentprofile: ", currentProfile);
  // Define state variables to hold fetched data
  const [todayQue, setTodayQue] = useState(0);
  const [silverPlan, setSilverPlan] = useState(0);
  const [goldPlan, setGoldPlan] = useState(0);
  const { id } = useParams();

  // const BASE_URL = "https://stack-overflow-clone-2024.onrender.com";
  const BASE_URL = "http://localhost:8080";

  const fetchData = async () => {
    try {
      const Id =
        currentUser?.result?._id === id ? currentUser?.result?._id : id;
      const apiUrl = `${BASE_URL}/questions/subscription/${Id}`;
      const response = await axios.get(apiUrl);
      console.log("fetched data: ", response?.data?.user);

      setTodayQue(response?.data?.user?.questionsPostedToday);
      setSilverPlan(response?.data?.user?.questionsPostedSilver);
      setGoldPlan(response?.data?.user?.questionsPostedGold);
    } catch (error) {
      console.error("Error fetching user subscription:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div>
          {currentProfile?.tags.length !== 0 ? (
            <>
              <h4>Tags watched</h4>
              {currentProfile?.tags.map((tag) => (
                <p key={tag}>{tag}</p>
              ))}
            </>
          ) : (
            <p>0 tags watched</p>
          )}
        </div>
        <div>
          {currentProfile?.about ? (
            <>
              <h4>About</h4>
              <p>{currentProfile?.about}</p>
            </>
          ) : (
            <p>No bio found</p>
          )}
        </div>
      </div>
      {currentUser?.result?._id === id && (
        <div style={{ border: "1px solid gray", width: "50%" }}>
          <div
            style={{
              textAlign: "center",
              fontWeight: "700",
              borderBottom: "1px solid grey",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>Subscription Plan</div>
              <div>
                <Link to={"/subscribe"}>
                  {" "}
                  <button>Add Plan</button>
                </Link>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "3px",
            }}
          >
            <div>
              Today:{" "}
              {todayQue === 1
                ? `You can ask Question`
                : `You have asked a question`}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                Subscription:{" "}
                {silverPlan !== 0
                  ? "Silver Plan"
                  : goldPlan !== 0
                  ? "Gold Plan"
                  : "No Plan"}
              </div>
              <div>
                Questions Remaining:{" "}
                {silverPlan !== 0 ? silverPlan : goldPlan !== 0 ? goldPlan : 0}{" "}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBio;
