import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Chat.module.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [actions, setActions] = useState([]);
  const [memories, setMemories] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [toggle, setToggle] = useState(false);

  const handleChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessages([...messages, newMessage, "Animus: Thanks for your message. I'm currently on vacation in the Himalayas! I'll get back to you when I'm back :)"]);
    setNewMessage("");
    // setToggle(!toggle);
  };

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }
    console.log("Fetching data...");
    const fetchData = async () => {
      const result = await axios.post(process.env.REACT_APP_ANIMUS_ENDPOINT, {
        messages: messages,
      });
      setInstructions(result.data.instructions);
      setActions(result.data.actions);
      setMemories(result.data.memories);
      setMessages(result.data.messages);
    };

    fetchData();

    // Scroll the chat messages to the bottom
    const chatMessages = document.querySelector(`.${styles["chat-messages"]}`);
    chatMessages.scrollTop = chatMessages.scrollHeight;

  }, [toggle]);

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
