import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Chat.module.css";

const Chat = ({ endpoint }) => {
  const [messages, setMessages] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [actions, setActions] = useState([]);
  const [memories, setMemories] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  console.log("TESTTTTT",process.env.REACT_APP_TEST);

  const handleChange = (event) => {
    setNewMessage(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(endpoint);
      setMessages(result.data.messages);
      setInstructions(result.data.instructions);
      setActions(result.data.actions);
      setMemories(result.data.memories);
    };
    fetchData();
  }, [endpoint]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessages(messages.concat("Julian: " + newMessage));
    const result = await axios.post(endpoint, {
      messages: messages,
    });
    setMessages(result.data.messages);
    setInstructions(result.data.instructions);
    setActions(result.data.actions);
    setMemories(result.data.memories);
    setNewMessage("");
  };

  return (
    <div className={styles["chat-container"]}>
      <div className={styles["chat-messages"]}>
        {messages.map((message, index) => (
          <div key={index} className={styles["chat-message"]}>
            {message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          type="text"
          value={newMessage}
          onChange={handleChange}
          className={styles["chat-input"]}
        />
        <button type="submit" className={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
