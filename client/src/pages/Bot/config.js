// config.js
import { createChatBotMessage } from "react-chatbot-kit";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

const config = {
    initialMessages: [createChatBotMessage("Hello user! Ask me about programming. Click on tags to learn more.")],
    botName: "StackChat",
    customStyles: {
        botMessageBox: {
            backgroundColor: "#376B7E",
        },
        chatButton: {
            backgroundColor: "#5ccc9d",
        },
    },
    widgets: [
        {
            widgetName: "programmingTags",
            widgetFunc: (props) => <ProgrammingTagsWidget {...props} />,
        },
    ],
};

const ProgrammingTagsWidget = (props) => {
    const { actionProvider } = props;

    return (
        <div>
            <p>Programming Tags: JavaScript, React, Node.js</p>
            <button onClick={actionProvider.handleProgrammingTags}>Show Tags</button>
        </div>
    );
};

export default config;
