//#region Import
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { HubConnectionBuilder } from "@microsoft/signalr";
import { InquiryChatService } from "../../service/InquiryChatService";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";
//#endregion

//#region Component: InquiryChatCreated
const InquiryChatCreated = () => {
  //#region State Initialization
  const [messages, setMessages] = useState([]); // State to store messages
  const [newMessage, setNewMessage] = useState(""); // State to store new message
  const [file, setFile] = useState(null); // State to store selected file
  const [connection, setConnection] = useState(null); // For the SignalR connection
  const [chatPersonType, setChatPersonType] = useState(""); // State for selected chat person type
  const [chatPersonList, setChatPersonList] = useState([]); // State for list of chat persons
  const [selectedPerson, setSelectedPerson] = useState(null); // State for selected partner/client/employee
  const [selectedPersonName, setSelectedPersonName] = useState(""); // State for the selected partner/client/employee name
  const [selectedPersonId, setSelectedPersonId] = useState(null); // State for the selected partner/client/employee ID
  const [inquiries, setInquiries] = useState([]); // State for storing inquiries
  const { id } = useParams();
  const loginId = sessionStorage.getItem("LoginUserId");
  const role = sessionStorage.getItem("role");
  //#endregion

  //#region Data Fetching
  // Fetch initial chat data
  const fetchData = debounce(async () => {

    if (chatPersonType === "createInquiryForwardedToPartner" && selectedPersonId != null) {
      const chatData = await InquiryChatService.getPartnerChatInAdmin(id, selectedPersonId);

      // Map through the chat data and set the senderName to "You" if selectedPersonId matches loginId
      const updatedMessages = chatData.data.map((message) => {
        if (message.senderId === loginId) {
          return { ...message, senderName: "You" }; // Set senderName to "You" if senderId matches
        }
        return message; // Otherwise, return the message as is
      });
      setMessages(updatedMessages); // Update the state with the modified messages
    }

    if (chatPersonType === "createInquiryForwardedToClient" && selectedPersonId != null) {
      const chatData = await InquiryChatService.getClientChatInAdmin(id, selectedPersonId);

      // Map through the chat data and set the senderName to "You" if senderId matches loginId
      const updatedMessages = chatData.data.map((message) => {
        if (message.senderId === loginId) {
          return { ...message, senderName: "You" }; // Set senderName to "You" if senderId matches
        }
        return message; // Otherwise, return the message as is
      });
      setMessages(updatedMessages); // Update the state with the modified messages
    }
  
  }, 300);
  
  useEffect(() => {
    fetchData();
  }, [id, selectedPersonId]);
  //#endregion

  //#region Scroll Handling
  // Scroll to the bottom when messages change
  useEffect(() => {
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);
  //#endregion

  //#region SignalR Connection
  // Set up SignalR connection
  useEffect(() => {

    // Set up SignalR connection
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7292/inquirychathub") // Your SignalR Hub URL
      .build();
  
    newConnection.start()
      .then(() => {
        console.log("Connected to SignalR Hub!");
      })
      .catch((error) => console.error("Error while starting connection: " + error));

    debugger;
    // Listen for incoming messages
    
    newConnection.on("ReceiveUserMessage", (chatMessage) => {
      if (chatMessage.senderId !== loginId && (chatMessage.receiverId === selectedPersonId) && chatMessage.inquiryRegistrationId === id) {
      setMessages((prevMessages) => [...prevMessages,chatMessage]); // Update the messages state with the new message
      // console.log(messages);
      }
      console.log(chatMessage);
    });

    newConnection.on("ReceiveAdminMessage", (chatMessage) => {
      if (chatMessage.senderId === selectedPersonId && chatMessage.inquiryRegistrationId === id) {
        // Append the new message to the state
        // const chatData =  InquiryChatService.getChatInAdmin(inquiryId, senderId);
        setMessages((prevMessages) => [...prevMessages, chatMessage]);
      }
      console.log(chatMessage);
    });
  
    setConnection(newConnection);
  
    // Cleanup on unmount
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [selectedPersonId]);
  //#endregion  

  //#region Chat Person Handling
  // Fetch chat persons based on selected type (Partner, Client, Employee)
  const handleChatPersonTypeChange = async (event) => {
    const selectedType = event.target.value;
    setChatPersonType(selectedType);
    setSelectedPerson(null); // Reset selected person when inquiry type changes
    setInquiries([]); // Clear inquiries on inquiry type change
    setSelectedPersonId(null);
    setSelectedPersonName("");
    setMessages([]); // Clear messages on inquiry type change

    if (!selectedType) {
      setChatPersonList([]); // Clear list if no type selected
      return;
    }

    try {
      const response = await InquiryChatService.getPartnerClientEmployeeList(selectedType, id);
      setChatPersonList(response.data); // Update the list with full person objects
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  // Handle selecting a person
  const handlePersonSelect = async (person) => {

    setSelectedPerson(person);
    setSelectedPersonName(person.name);
    setSelectedPersonId(person.userId);
    fetchData();
    // Fetch inquiries based on the selected person
    try {
      const response = await InquiryChatService.getPartnerClientEmployeeInquiry(
        chatPersonType, person.userId
      );
      setInquiries(response.data); // Set inquiries for the sele  cted person
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };
  //#endregion

  //#region Message Handling
  // Handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim() || file) {
      const newMessageObj = {
        inquiryRegistrationId: id,
        message: newMessage,
        receiverId: selectedPersonId,
        // sentDate: new Date().toISOString(),
      };

      debugger;

      const formData = new FormData();
      if (file) {
        formData.append("chatMessageVM.file", file);
        formData.append("chatMessageVM.Message", null); // Send message as null if file is attached
      } else {
        formData.append("chatMessageVM.Message", newMessageObj.message);
      }

      formData.append("chatMessageVM.InquiryRegistrationId", newMessageObj.inquiryRegistrationId);
      formData.append("chatMessageVM.ReceiverId", newMessageObj.receiverId);
      // formData.append("chatMessageVM.SentDate", newMessageObj.sentDate);

      try {
        const response = await InquiryChatService.addInquiryChat(formData);
        if (response.status === 1) {
          console.log("Chat added successfully!");
          
          // Broadcast the message to other clients via SignalR
          // debugger;
          // if (connection) {
          //   connection.invoke("SendPrivateMessage", newMessageObj);  // Send the message to the SignalR Hub
          // }

          // if (connection) {
          //   connection.invoke("SendMessageToUser", newMessageObj);  // Send the message to the SignalR Hub
          // }

          
          setMessages((prevMessages) => [
            ...prevMessages,
            { senderName: "You", message: newMessageObj.message, sentDate: new Date().toISOString(), file: file ? file : null, },
          ]);

          // Clear input fields after sending
          setNewMessage("");
          setFile(null);
        } else {
          console.error("Failed to add chat:", response.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error adding chat:", error);
      }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  //#endregion

  //#region render
  return (
    <>
      {/* Select Chat Person Type */}
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <label htmlFor="chatPersonType" className="block text-lg font-semibold">Select Chat Person</label>
          <select
            id="chatPersonType"
            className="mt-2 p-2 border border-gray-300 rounded-lg w-full border-active"
            value={chatPersonType}
            onChange={handleChatPersonTypeChange}
          >
            <option value="">--Select Type--</option>
            <option value="createInquiryForwardedToPartner">Partner</option>
            <option value="createInquiryForwardedToClient">Client</option>
            <option value="createInquiryForwardedToEmployee">Employee</option>
          </select>
        </div>

        {/* Select Person based on Type */}
        {chatPersonType && (
          <div className="flex-1">
            <label htmlFor="chatPerson" className="block text-lg font-semibold">Select {chatPersonType}</label>
            <select
              id="chatPerson"
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full border-active"
              onChange={(e) => {
                const selectedPerson = chatPersonList.find(
                  (person) => person.name === e.target.value
                );
                handlePersonSelect(selectedPerson);
              }}
            >
              <option value="">--Select {chatPersonType}--</option>
              {chatPersonList.map((person) => (
                <option key={person.userId} value={person.name}>{person.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chat Section */}
      {selectedPerson ? (
      <section className="bg-white rounded-lg shadow-lg mt-8 p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Chat with {selectedPersonName}</h2>

        {/* Chat Window */}
        <div
          id="chatContainer"
          className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto mb-4 shadow-inner space-y-4 border border-gray-200"
        >
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">Start a conversation...</p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.senderName === "You" || message.selectedPersonId === loginId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${message.senderName === "You" || message.selectedPersonId === loginId
                    ? "bg-blue-300 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-700 rounded-bl-none"}`}
                >
                  <div className="font-semibold text-sm">{message.senderName}</div>
                  <div className="text-black">{message.message}</div>

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
                            href={URL.createObjectURL(message.filePath)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {message.file.name}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-600 mt-2">{formatDate(message.sentDate)}</div>
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

          {/* Display the file name if selected */}
          {file && (
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md w-1/3">
              <span className="text-sm text-gray-700 truncate">{file.name}</span>
              <button
                onClick={clearFile}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
            </div>
          )}

          {/* Send Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition border-active"
          >
            Send
          </motion.button>
        </div>
      </section>
      ) : (
        <p>Please select an person to start the chat.</p>
      )}  
    </>
  );
  //#endregion
};

export default InquiryChatCreated;
//#endregion