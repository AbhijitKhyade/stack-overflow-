import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import HomeMainBar from "../../components/HomeMainBar/HomeMainBar";

const Questions = () => {
  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2 que-details">
        <HomeMainBar />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Questions;
