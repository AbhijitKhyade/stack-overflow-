import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";

import LeftSidebar from "./../../components/LeftSidebar/LeftSidebar";
import Avatar from "./../../components/Avatar/Avatar";
import EditProfileForm from "./EditProfileForm";
import ProfileBio from "./ProfileBio";
import gold from "../../assets/gold-badge.png";
import silver from "../../assets/silver-badge.png";
import bronze from "../../assets/bronze-badge.png";
import "./UserProfile.css";

const UserProfile = () => {
  const [Switch, setSwitch] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);
  const [badgeCounts, setBadgeCounts] = useState({
    gold: 0,
    silver: 0,
    bronze: 0,
  });
  const [badgePoints, setBadgePoints] = useState({
    gold: 0,
    silver: 0,
    bronze: 0,
  });

  const { id } = useParams();
  const users = useSelector((state) => state.userReducer);
  const currentProfile = users.filter((user) => user._id === id)[0];
  // const questionsList = useSelector((state) => state.questionsReducer);
  const currentUser = useSelector((state) => state.currentUserReducer);
  const [congratulationMessage, setCongratulationMessage] = useState("");
  // console.log("ques:", questionsList);

  const fetchLoginHistory = async () => {
    if (currentUser?.result?._id === id) {
      // console.log(id);
      // console.log(currentUser?.result?._id);
      // Fetch user login history using Axios
      try {
        const { data } = await axios.get(
          `https://stack-overflow-2024.onrender.com/user/login-history/${currentUser?.result?._id}`
        );

        setLoginHistory(data?.loginHistory);
        // console.log(data?.loginHistory);
      } catch (error) {
        console.error("Error fetching login history:", error);
      }
    }
  };

  // useEffect(() => {
  //   fetchLoginHistory();
  // }, [id, currentUser?.token]);

  const getBadgeCounts = async (userId) => {
    try {
      const response = await axios.post(
        `https://stack-overflow-2024.onrender.com/user/update-badge-count`,
        { userId }
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error fetching badge counts:", error);
      return {};
    }
  };

  const updateBadgeCounts = async () => {
    try {
      const {
        goldBadge,
        silverBadge,
        bronzeBadge,
        goldPoints,
        silverPoints,
        bronzePoints,
      } = await getBadgeCounts(id);

      // console.log("count", goldBadge, silverBadge, bronzeBadge);
      // console.log("points:...", goldPoints, silverPoints, bronzePoints);

      setBadgeCounts({
        gold: goldBadge,
        silver: silverBadge,
        bronze: bronzeBadge,
      });

      setBadgePoints({
        gold: goldPoints,
        silver: silverPoints,
        bronze: bronzePoints,
      });

      // Show congratulation message when badges are awarded
      if (goldPoints >= 5) {
        setCongratulationMessage(
          "Congratulations! You've earned a Gold Badge!"
        );
      } else if (silverPoints >= 5) {
        setCongratulationMessage(
          "Congratulations! You've earned a Silver Badge!"
        );
      } else if (bronzePoints >= 5) {
        setCongratulationMessage(
          "Congratulations! You've earned a Bronze Badge!"
        );
      }

      // Clear the congratulation message after 1 hour (3600000 milliseconds)
      setTimeout(() => {
        setCongratulationMessage("");
      }, 3600000);

      // console.log("Badge counts and points updated on the frontend");
    } catch (error) {
      console.error("Error updating badge counts on the frontend:", error);
    }
  };

  const awardBadges = () => {
    // Logic to award badges based on counts
    // You can use badgePoints to display the points on the frontend
    // and updateBadgeCounts to update the counts after awarding
    // ...

    // Example: Award gold badge if the user has 5 or more gold points
    if (badgePoints.gold >= 5) {
      console.log("Gold Badge Awarded!");
      // Update counts after awarding
      updateBadgeCounts();
    }
  };

  useEffect(() => {
    fetchLoginHistory();
    updateBadgeCounts();
  }, [id, currentUser?.token]);

  useEffect(() => {
    awardBadges();
  }, [badgeCounts]);
  // console.log("count:", badgeCounts, "badgePoints:", badgePoints);

  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2">
        <section>
          <div className="user-details-container">
            <div className="user-details">
              <Avatar
                backgroundColor="purple"
                color="white"
                fontSize="50px"
                px="45px"
                py="30px"
              >
                {currentProfile?.name.charAt(0).toUpperCase()}
              </Avatar>
              <div className="user-name">
                <h1>{currentProfile?.name}</h1>
                <p id="color">{congratulationMessage}</p>
                <p>
                  <i class="fa-solid fa-cake-candles"></i> Joined{" "}
                  {moment(currentProfile?.joinedOn).fromNow()}
                </p>
              </div>
            </div>
            {currentUser?.result._id === id && (
              <button
                type="button"
                onClick={() => setSwitch(true)}
                className="edit-profile-btn"
              >
                <i class="fa-solid fa-pen"></i> Edit Profile
              </button>
            )}
          </div>

          <>
            {Switch ? (
              <EditProfileForm
                currentUser={currentUser}
                setSwitch={setSwitch}
              />
            ) : (
              <>
                <ProfileBio currentProfile={currentProfile} />
                <div className="login-history-container">
                  <h2>Login History</h2>
                  <table className="login-history-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Browser</th>
                        <th>OS</th>
                        <th>Device</th>
                        <th>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginHistory[0]?.userLoginHistory?.map(
                        (login, loginIndex) => (
                          <tr key={loginIndex._id}>
                            <td>
                              {moment(login.timestamp).format(
                                "YYYY-MM-DD | hh:mm:ss A"
                              )}
                            </td>
                            <td>{login.browser}</td>
                            <td>{login.os}</td>
                            <td>{login.device}</td>
                            <td>{login.ip}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        </section>

        <div>
          <div>
            <h1>Badges Earned</h1>
          </div>
          <main>
            <div className="top">
              <div className="img-icon">
                <img src={gold} alt="gold" width={"65px"} height={"65px"} />
              </div>
              <div className="counts">
                <p className="cnt">{badgeCounts.gold}</p>
                <p className="badge">gold badges</p>
                <p className="points">{badgePoints.gold} points</p>
              </div>
            </div>
            <div className="top">
              <div className="img-icon">
                <img src={silver} alt="silver" width={"65px"} height={"65px"} />
              </div>
              <div className="counts">
                <p className="cnt">{badgeCounts.silver}</p>
                <p className="badge">silver badges</p>
                <p className="points">{badgePoints.silver} points</p>
              </div>
            </div>
            <div className="top">
              <div className="img-icon">
                <img src={bronze} alt="bronze" width={"65px"} height={"65px"} />
              </div>
              <div className="counts">
                <p className="cnt">{badgeCounts.bronze}</p>
                <p className="badge">bronze badges</p>
                <p className="points">{badgePoints.bronze} points</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
