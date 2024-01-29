import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./config.js";
import MessageParser from "./MessageParser.jsx";
import ActionProvider from "./ActionProvider.jsx";
import "./BotComp.css";
import bot from "../../assets/robot.png";

const BotComp = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div>
      {isChatbotOpen && (
        <div className="chatbot-container">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
      <div className="chatbot-icon" onClick={toggleChatbot}>
        <img src={bot} alt="Chatbot Icon" width={"70px"} height={"70px"} />
      </div>
    </div>
  );
};

export default BotComp;