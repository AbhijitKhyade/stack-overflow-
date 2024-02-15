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
  const currentUser = useSelector((state) => state.currentUserReducer);
  const [congratulationMessage, setCongratulationMessage] = useState("");
  const BASE_URL = "https://stack-overflow-clone-2024.onrender.com";
  // const BASE_URL = "http://localhost:8080";
  // console.log("user:", currentProfile);
  // console.log("Redux: ", currentUser);
  // console.log("user id:", id);

  //fetch login history
  useEffect(() => {
    const fetchLoginHistory = async () => {
      if (currentUser?.result?._id === id) {
        try {
          const { data } = await axios.get(
            `${BASE_URL}/user/login-history/${currentUser?.result?._id}`
          );

          setLoginHistory(data?.loginHistory);
        } catch (error) {
          console.error("Error fetching login history:", error);
        }
      }
    };
    fetchLoginHistory();
  }, [currentUser?.result?._id, id]);


  //fetch badge
  useEffect(() => {
    const getBadgeCounts = async (Id) => {
      try {
        // console.log("userId: ", Id);

        // console.log("Current user:: ", currentUser?.result?._id);
        const response = await axios.post(`${BASE_URL}/user/update-badge-count/${Id}`);
        // console.log("badge response:", response?.data?.data?.badges);
        return response?.data?.data?.badges;
      } catch (error) {
        console.error("Error fetching badge counts:", error);
      }
    };

    const updateBadgeCounts = async () => {
      const Id = currentUser?.result?._id === id ? currentUser?.result?._id : id;
      try {
        const { gold, silver, bronze } = await getBadgeCounts(Id);
        // console.log("returned data:", { gold, silver, bronze });
        setBadgeCounts({
          gold: gold.count,
          silver: silver.count,
          bronze: bronze.count,
        });

        setBadgePoints({
          gold: gold.points,
          silver: silver.points,
          bronze: bronze.points,
        });

        // if (goldPoints >= 5) {
        //   setCongratulationMessage(
        //     "Congratulations! You've earned a Gold Badge!"
        //   );
        // } else if (silverPoints >= 5) {
        //   setCongratulationMessage(
        //     "Congratulations! You've earned a Silver Badge!"
        //   );
        // } else if (bronzePoints >= 5) {
        //   setCongratulationMessage(
        //     "Congratulations! You've earned a Bronze Badge!"
        //   );
        // }

        // setTimeout(() => {
        //   setCongratulationMessage("");
        // }, 360000);

      } catch (error) {
        console.error("Error updating badge counts on the frontend:", error);
      }
    };
    getBadgeCounts();
    updateBadgeCounts();
  }, [currentUser?.result?._id, id]);



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
            {currentUser?.result?._id === id && (
              <button
                type="button"
                onClick={() => setSwitch(true)}
                className="edit-profile-btn"
              >
                <i class="fa-solid fa-pen"></i> Edit Profile
              </button>
            )}
          </div>

          {currentUser?.result && (
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
          )}
        </section>

        {currentUser?.result && (

          <>
            <div className="badge-details">
              <div className="gold">
                <h2>Gold Badge Criteria</h2>
                <p>User will get gold badge when he or she has 5 or more votes on his or her asked question </p>
                <p>Points gained is 10 on one gold badge</p>
              </div>
              <div className="silver">
                <h2>Silver Badge Criteria</h2>
                <p>User will get silver badge when he or she answers to 4 or more questions </p>
                <p>Points gained is 4 on one silver badge</p>
              </div>
              <div className="bronze">
                <h2>Bronze Badge Criteria</h2>
                <p>User will get bronze badge when he or she asks 3 or more questions </p>
                <p>Points gained is 3 on one bronze badge</p>
              </div>
            </div>
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
                    <img
                      src={silver}
                      alt="silver"
                      width={"65px"}
                      height={"65px"}
                    />
                  </div>
                  <div className="counts">
                    <p className="cnt">{badgeCounts.silver}</p>
                    <p className="badge">silver badges</p>
                    <p className="points">{badgePoints.silver} points</p>
                  </div>
                </div>
                <div className="top">
                  <div className="img-icon">
                    <img
                      src={bronze}
                      alt="bronze"
                      width={"65px"}
                      height={"65px"}
                    />
                  </div>
                  <div className="counts">
                    <p className="cnt">{badgeCounts.bronze}</p>
                    <p className="badge">bronze badges</p>
                    <p className="points">{badgePoints.bronze} points</p>
                  </div>
                </div>
              </main>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
