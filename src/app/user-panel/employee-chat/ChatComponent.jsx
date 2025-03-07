import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { HubConnectionBuilder } from "@microsoft/signalr";


const ChatComponent = ({ taskAssignToName }) => {

  const [messages, setMessages] = useState([]); // State to store messages
  const [newMessage, setNewMessage] = useState(""); // State to store new message
  const [file, setFile] = useState(null); // State to store selected file
  const [connection, setConnection] = useState(null); // For the SignalR connection

  useEffect(() => {
    // Set up SignalR connection
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/chatHub') // Your API SignalR Hub endpoint
      .build();

    newConnection.start()
      .then(() => {
        console.log("Connected to SignalR Hub!");
      })
      .catch((error) => console.error('Error while starting connection: ' + error));

    // Listen for incoming messages
    newConnection.on('ReceiveMessage', (user, message) => {
      setMessages((prevMessages) => [...prevMessages, { user, message }]);
    });

    // Set connection state
    setConnection(newConnection);

    // Clean up on component unmount
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  // Handle sending a message
  const handleSendMessage = () => {
    if (newMessage.trim() || file) {
      if (connection) {
        connection.invoke('SendMessage', 'You', newMessage) // Send to SignalR Hub
          .catch((err) => console.error(err));
      }
      const newMessageObj = {
        id: messages.length + 1,
        text: newMessage,
        sender: "You",
        timestamp: new Date().toLocaleTimeString(),
        file: file ? file : null, // Attach file if any
      };
      setMessages((prevMessages) => [...prevMessages, newMessageObj]);
      setNewMessage(""); // Clear input field after sending
      setFile(null); // Clear file after sending
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Clear file selection
  const clearFile = () => {
    setFile(null);
  };

  return (
    <>
      {/* Chat Section */}
      <section className="bg-white rounded-lg shadow-lg mt-8 p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Chat with {taskAssignToName}</h2>

        {/* Chat Window */}
        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto mb-4 shadow-inner space-y-4 border border-gray-200">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">Start a conversation...</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${
                    message.sender === "You"
                      ? "bg-blue-300 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-700 rounded-bl-none"
                  }`}
                >
                  <div className="font-semibold text-sm">{message.sender}</div>
                  <div className="text-black">{message.text}</div>

                  {/* File Preview */}
                  {message.file && (
                    <div className="mt-2">
                      {message.file.type.includes("image") ? (
                        <img
                          src={URL.createObjectURL(message.file)}
                          alt="file-preview"
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      ) : (
                        <div className="text-xs text-blue-500 mt-1">
                          <a
                            href={URL.createObjectURL(message.file)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {message.file.name}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-600 mt-2">{message.timestamp}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input Section */}
        <div className="flex items-center gap-3">
          {/* Input Field */}
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />

          {/* File Upload Button */}
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="inline-block bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Display the file name in the input field if a file is selected */}
          {file && (
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md w-1/3">
              <span className="text-sm text-gray-700 truncate">{file.name}</span>
              <button
                onClick={clearFile}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                &times; {/* 'X' icon to remove the file */}
              </button>
            </div>
          )}

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Send
          </motion.button>
        </div>
      </section>
    </>
  );
};

export default ChatComponent;
