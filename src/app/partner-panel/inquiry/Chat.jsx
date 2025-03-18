import React, { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { InquiryService } from "../../service/InquiryService"; // You can use this service to get/send chat data

const Chat = ({ inquiryId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch chat messages for the given inquiryId
        const response = await InquiryService.getChatMessages(inquiryId);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    if (inquiryId) {
      fetchMessages();
    }
  }, [inquiryId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return; // Avoid sending empty messages

    try {
      // Send the new message to the backend
      const response = await InquiryService.sendMessage({
        inquiryId,
        message: newMessage,
      });

      // Update the message list with the newly sent message
      setMessages([...messages, response.data]);
      setNewMessage(""); // Clear the message input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="h-60 overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-lg">
        {/* Display the chat messages */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.sender === "admin" ? "text-left" : "text-right"
            }`}
          >
            <div
              className={`${
                message.sender === "admin" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
              } p-2 rounded-lg inline-block max-w-[80%]`}
            >
              {message.text}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Message input area */}
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white p-2 rounded-lg"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
