import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { HubConnectionBuilder } from "@microsoft/signalr";
import { InquiryChatService } from "../../service/InquiryChatService";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";

const Chat = () => {
  const [messages, setMessages] = useState([]); // State to store messages
  const [newMessage, setNewMessage] = useState(""); // State to store new message
  const [file, setFile] = useState(null); // State to store selected file
  const [connection, setConnection] = useState(null); // For the SignalR connection

  const { id } = useParams();
  const loginId = sessionStorage.getItem("LoginUserId");

  // const senderId = loginId;
  const fetchData = debounce(async () => {
    // try {
        const chatData = await InquiryChatService.getAdminChatInPartner(id);
        // debugger;

        const updatedMessages = chatData.data.map((message) => {
            if (message.senderId === loginId) {
                return { ...message, senderName: "You" };
            }
            return message;
        });

        setMessages(updatedMessages);
    // } catch (error) {
    //     console.error("Error fetching chat data:", error);
    // }
// }, 
      },300); // Debounce interval in milliseconds
  // Fetch initial chat data
  useEffect(() => {
    fetchData();
  }, [id]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  // Set up SignalR connection
  useEffect(() => {

    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7292/inquirychathub") // Your SignalR Hub URL
      .build();

    newConnection.start()
      .then(() => {
        console.log("Connected to SignalR Hub!");
      })
      .catch((error) => console.error("Error while starting connection: " + error));

    // Listen for the new message from SignalR
    newConnection.on("ReceiveUserMessage", (chatMessage) => {
      fetchData();
      // console.log("Received message:", chatMessage);
      if (newMessage.senderId !== loginId && newMessage.inquiryRegistrationId === id) {
        // Append the new message to the state
        // const chatData =  InquiryChatService.getChatInAdmin(inquiryId, senderId);
        setMessages((prevMessages) => [...prevMessages, chatMessage]);
      }
      console.log(messages);
    });

    setConnection(newConnection);

    // Cleanup on unmount
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };

  }, [id]);

  // Handle sending a message
  
  
  const handleSendMessage = async () => {
    if (newMessage.trim() || file) {
      const newMessageObj = {
        inquiryRegistrationId: id,
        message: newMessage,
        // sentDate: new Date().toISOString(),
        // receiverId: senderId,
      };

      const formData = new FormData();
      if (file) {
        formData.append("chatMessageVM.file", file);
        formData.append("chatMessageVM.Message", null); // Send message as null if file is attached
      } else {
        formData.append("chatMessageVM.Message", newMessageObj.message);
      }
      
      formData.append("chatMessageVM.InquiryRegistrationId", newMessageObj.inquiryRegistrationId);
      // formData.append("chatMessageVM.SentDate", newMessageObj.sentDate);
      // formData.append("chatMessageVM.ReceiverId", newMessageObj.receiverId);

      try {
        const response = await InquiryChatService.addPartnerInquiryChat(formData);
          if (response.status === 1) {
            console.log("Chat added successfully!");
            
          // Broadcast the message to other clients via SignalR
          // if (connection) {
          //   connection.invoke("SendMessage", newMessageObj);  // Send the message to the SignalR Hub
          // }

          // Broadcast the message to other clients via SignalR
          // if (connection) {
          //   connection.invoke("SendMessageToAdmin", newMessageObj);  // Send the message to the SignalR Hub
          // }


          // Update the local messages state to include the new message
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
      weekday: 'short', // Optional: to show weekday
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Optional: true for 12-hour format, false for 24-hour format
    });
  };

  return (
    <>
      {/* Chat Section */}
      <section className="bg-white rounded-lg shadow-lg mt-8 p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Chat</h2>

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
                className={`flex ${message.senderName === "You" || message.senderId === loginId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${
                    message.senderName === "You" || message.senderId === loginId
                      ? "bg-blue-300 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-700 rounded-bl-none"
                  }`}
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
                          <img
                            src={URL.createObjectURL(message.filePath)}
                            alt="file-preview"
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                            {message.file.name}
                          {/* </a> */}
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
    </>
  );
};

export default Chat;






// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion"; // Import framer-motion
// import { HubConnectionBuilder } from "@microsoft/signalr";
// import { InquiryChatService } from "../../service/InquiryChatService";
// import { useParams } from "react-router-dom";

// const Chat = ({ senderId }) => {
//   const [messages, setMessages] = useState([]); // State to store messages
//   const [newMessage, setNewMessage] = useState(""); // State to store new message
//   const [file, setFile] = useState(null); // State to store selected file
//   const [connection, setConnection] = useState(null); // For the SignalR connection
//   const [chatPersonType, setChatPersonType] = useState(""); // State for selected chat person type
//   const [chatPersonList, setChatPersonList] = useState([]); // State for list of chat persons
//   const [selectedPerson, setSelectedPerson] = useState(null); // State for selected partner/client/employee
//   const [selectedPersonName, setSelectedPersonName] = useState(""); // State for the selected partner/client/employee name
//   const [selectedPersonId, setSelectedPersonId] = useState(null); // State for the selected partner/client/employee ID
//   const [inquiries, setInquiries] = useState([]); // State for storing inquiries
//   const { id } = useParams();
//   const loginId = sessionStorage.getItem("LoginUserId");

//   // Fetch initial chat data
//   useEffect(() => {
//     const fetchData = async () => {
//       const chatData = await InquiryChatService.getChatInAdmin(id, senderId);
//       setMessages(chatData.data);
//       console.log(chatData);
//     };
//     fetchData();
//   }, [id, senderId]);

//   // Scroll to the bottom when messages change
//   useEffect(() => {
//     const chatContainer = document.getElementById("chatContainer");
//     if (chatContainer) {
//       chatContainer.scrollTop = chatContainer.scrollHeight;
//     }
//   }, [messages]);

//   // Set up SignalR connection
//   useEffect(() => {
//     const newConnection = new HubConnectionBuilder()
//       .withUrl("https://localhost:7292/inquirychathub") // Your SignalR Hub URL
//       .build();

//     newConnection.start()
//       .then(() => {
//         console.log("Connected to SignalR Hub!");
//       })
//       .catch((error) => console.error("Error while starting connection: " + error));

//     newConnection.on("ReceiveMessage", (chatData) => {
//       setMessages((prevMessages) => [...prevMessages, chatData]);
//     });

//     setConnection(newConnection);

//     // Cleanup on unmount
//     return () => {
//       if (newConnection) {
//         newConnection.stop();
//       }
//     };
//   }, []);

//   // Fetch chat persons based on selected type (Partner, Client, Employee)
//   const handleChatPersonTypeChange = async (event) => {
//     const selectedType = event.target.value;
//     setChatPersonType(selectedType);
//     setSelectedPerson(null); // Reset selected person when inquiry type changes
//     setInquiries([]); // Clear inquiries on inquiry type change
//     setSelectedPersonId(null);
//     setSelectedPersonName("");

//     if (!selectedType) {
//       setChatPersonList([]); // Clear list if no type selected
//       return;
//     }

//     try {
//       const response = await InquiryChatService.getPartnerClientEmployeeList(selectedType, id);
//       setChatPersonList(response.data); // Update the list with full person objects
//     } catch (error) {
//       console.error("Error fetching inquiries:", error);
//     }
//   };

//   // Handle selecting a person
//   const handlePersonSelect = async (person) => {
//     setSelectedPerson(person);
//     setSelectedPersonName(person.name);
//     setSelectedPersonId(person.userId);

//     // Fetch inquiries based on the selected person
//     try {
//       const response = await InquiryChatService.getPartnerClientEmployeeInquiry(
//         chatPersonType, person.userId
//       );
//       setInquiries(response.data); // Set inquiries for the sele  cted person
//     } catch (error) {
//       console.error("Error fetching inquiries:", error);
//     }
//   };

//   // Handle sending a message
//   const handleSendMessage = async () => {
//     if (newMessage.trim() || file) {
//       const newMessageObj = {
//         inquiryRegistrationId: id,
//         message: newMessage,
//         receiverId: senderId,
//       };

//       const formData = new FormData();
//       if (file) {
//         formData.append("chatMessageVM.file", file);
//         formData.append("chatMessageVM.Message", null); // Send message as null if file is attached
//       } else {
//         formData.append("chatMessageVM.Message", newMessageObj.message);
//       }

//       formData.append("chatMessageVM.InquiryRegistrationId", newMessageObj.inquiryRegistrationId);
//       formData.append("chatMessageVM.ReceiverId", newMessageObj.receiverId);

//       try {
//         const response = await InquiryChatService.addInquiryChat(formData);
//         if (response.status === 1) {
//           console.log("Chat added successfully!");
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { user: "You", message: newMessageObj.message, file: file ? file : null },
//           ]);

//           // Clear input fields after sending
//           setNewMessage("");
//           setFile(null);
//         } else {
//           console.error("Failed to add chat:", response.message || "Unknown error");
//         }
//       } catch (error) {
//         console.error("Error adding chat:", error);
//       }
//     }
//   };

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   // Clear file selection
//   const clearFile = () => {
//     setFile(null);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       weekday: 'short',
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   return (
//     <>
//       {/* Select Chat Person Type */}
//       <div className="mb-4 flex gap-4">
//         <div className="flex-1">
//           <label htmlFor="chatPersonType" className="block text-lg font-semibold">Select Chat Person</label>
//           <select
//             id="chatPersonType"
//             className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
//             value={chatPersonType}
//             onChange={handleChatPersonTypeChange}
//           >
//             <option value="">--Select Type--</option>
//             <option value="partner">Partner</option>
//             <option value="client">Client</option>
//             <option value="employee">Employee</option>
//           </select>
//         </div>

//         {/* Select Person based on Type */}
//         {chatPersonType && (
//           <div className="flex-1">
//             <label htmlFor="chatPerson" className="block text-lg font-semibold">Select {chatPersonType}</label>
//             <select
//               id="chatPerson"
//               className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
//               onChange={(e) => {
//                 const selectedPerson = chatPersonList.find(
//                   (person) => person.name === e.target.value
//                 );
//                 handlePersonSelect(selectedPerson);
//               }}
//             >
//               <option value="">--Select {chatPersonType}--</option>
//               {chatPersonList.map((person) => (
//                 <option key={person.userId} value={person.name}>{person.name}</option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       {/* Chat Section */}
      
//       {selectedPerson ? (
//       <section className="bg-white rounded-lg shadow-lg mt-8 p-6">
//         <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Chat with {selectedPersonName}</h2>

//         {/* Chat Window */}
//         <div
//           id="chatContainer"
//           className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto mb-4 shadow-inner space-y-4 border border-gray-200"
//         >
//           {messages.length === 0 ? (
//             <p className="text-center text-gray-500">Start a conversation...</p>
//           ) : (
//             messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`flex ${message.user === "You" || message.senderId === loginId ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${message.user === "You" || message.senderId === senderId
//                     ? "bg-blue-300 text-white rounded-br-none"
//                     : "bg-gray-200 text-gray-700 rounded-bl-none"}`}
//                 >
//                   <div className="font-semibold text-sm">{message.user}</div>
//                   <div className="text-black">{message.message}</div>

//                   {/* File Preview */}
//                   {message.file && (
//                     <div className="mt-2">
//                       {message.file.type.includes("image") ? (
//                         <img
//                           src={URL.createObjectURL(message.file)}
//                           alt="file-preview"
//                           className="w-20 h-20 object-cover rounded-md"
//                         />
//                       ) : (
//                         <div className="text-xs text-blue-500 mt-1">
//                           <a
//                             href={URL.createObjectURL(message.file)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             {message.file.name}
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   <div className="text-xs text-gray-600 mt-2">{formatDate(message.sentDate)}</div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Message Input Section */}
//         <div className="flex items-center gap-3">
//           {/* Input Field */}
//           <input
//             type="text"
//             className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
//             placeholder="Type your message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//           />

//           {/* File Upload Button */}
//           <label htmlFor="file-upload" className="cursor-pointer">
//             <span className="inline-block bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 className="w-6 h-6 text-gray-600"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//             </span>
//           </label>
//           <input
//             id="file-upload"
//             type="file"
//             className="hidden"
//             onChange={handleFileChange}
//           />

//           {/* Display the file name if selected */}
//           {file && (
//             <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md w-1/3">
//               <span className="text-sm text-gray-700 truncate">{file.name}</span>
//               <button
//                 onClick={clearFile}
//                 className="text-xs text-gray-500 hover:text-red-500"
//               >
//                 &times;
//               </button>
//             </div>
//           )}

//           {/* Send Button */}
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={handleSendMessage}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
//           >
//             Send
//           </motion.button>
//         </div>
//       </section>
//       ) : (
//         <p>Please select an person to start the chat.</p>
//       )}
        
//     </>
//   );
// };

// export default Chat;













// import React, { useEffect, useState } from "react";
// import { FaPaperPlane } from "react-icons/fa";
// import { InquiryService } from "../../service/InquiryService"; // You can use this service to get/send chat data

// const Chat = ({ inquiryId }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         // Fetch chat messages for the given inquiryId
//         const response = await InquiryService.getChatMessages(inquiryId);
//         setMessages(response.data);
//       } catch (error) {
//         console.error("Error fetching chat messages:", error);
//       }
//     };

//     if (inquiryId) {
//       fetchMessages();
//     }
//   }, [inquiryId]);

//   const handleSendMessage = async () => {
//     if (newMessage.trim() === "") return; // Avoid sending empty messages

//     try {
//       // Send the new message to the backend
//       const response = await InquiryService.sendMessage({
//         inquiryId,
//         message: newMessage,
//       });

//       // Update the message list with the newly sent message
//       setMessages([...messages, response.data]);
//       setNewMessage(""); // Clear the message input after sending
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col space-y-4">
//       <div className="h-60 overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-lg">
//         {/* Display the chat messages */}
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`${
//               message.sender === "admin" ? "text-left" : "text-right"
//             }`}
//           >
//             <div
//               className={`${
//                 message.sender === "admin" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
//               } p-2 rounded-lg inline-block max-w-[80%]`}
//             >
//               {message.text}
//             </div>
//             <div className="text-sm text-gray-500 mt-1">
//               {new Date(message.timestamp).toLocaleString()}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Message input area */}
//       <div className="flex items-center gap-2 mt-3">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="flex-grow p-2 border rounded-lg"
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={handleSendMessage}
//           className="bg-blue-600 text-white p-2 rounded-lg"
//         >
//           <FaPaperPlane />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
