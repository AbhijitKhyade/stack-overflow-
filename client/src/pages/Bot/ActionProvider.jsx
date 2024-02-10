// ActionProvider.jsx
import { createChatBotMessage } from "react-chatbot-kit";

const ActionProvider = (props) => {
  const { setState } = props;

  const handleProgrammingTags = () => {
    const tagsMessage = createChatBotMessage(
      "Available programming tags: JavaScript, React, Node.js"
    );
    setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, tagsMessage],
    }));
  };

  return {
    handleProgrammingTags,
  };
};

export default ActionProvider;
