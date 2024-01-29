import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import HomeMainBar from "../../components/HomeMainBar/HomeMainBar";
import "../../App.css";

const Home = () => {
  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2">
        <HomeMainBar />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
