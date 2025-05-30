//#region Imports
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TaskNoteService } from "../../../service/TaskNoteService";
//#endregion

//#region Component: UserTaskNoteList
const UserTaskNoteList = () => {
  //#region State Variables
  const { id } = useParams();
  const [taskNotes, setTaskNotes] = useState([]);
  const navigate = useNavigate("");
  //#endregion

  //#region Fetch Task Note
  useEffect(() => {
    const fetchTaskNotes = async () => {
      try {
        const result = await TaskNoteService.getTaskNoteByTaskId(id);
        setTaskNotes(result.data);
        console.log(result.data)

      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTaskNotes([]);
      }
    };
    fetchTaskNotes();
  }, [id]);
  //#endregion

  //#region Format Date 
  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the date format as needed
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3 ">
        <h1 className="font-semibold text-2xl">Task Note List</h1>
        {/* <button
            onClick={() => navigate(-1)} // Navigate back to previous page
            className="px-6 py-2 bg-gray-300 text-black rounded-md font-semibold hover:bg-gray-400 transition duration-200"
          >
            Back
          </button> */}
          <Link
          onClick={() => navigate(-1)} // Navigate back to previous page
          className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
        >
          <FaArrowLeft size={16} />
          Back
        </Link>
      </div>

      {/* Task Note List Table */}
      <div className="grid overflow-x-auto shadow-xl">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-900 border-b">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Name
              </th>
              {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Assigned By
              </th> */}
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Created By
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Date
              </th>
              {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Time In
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Time Out
              </th> */}
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Duration
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Updates
              </th>
              {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Updates
              </th> */}
              {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Status
              </th> */}
              {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody>
            {taskNotes.map((item) => (
              <tr
                key={item.taskNoteId}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-gray-700">{item.taskName}</td>
                <td className="py-3 px-4 text-gray-700">
                  {item.taskCreatedByName}
                </td>
                {/* <td className="py-3 px-4 text-gray-700">
                  {item.taskAssignByName}
                </td> */}
                <td className="py-3 px-4 text-gray-700">{formatDate(item.taskDate)}</td>
                {/* <td className="py-3 px-4 text-gray-700">
                  {item.taskTimeIn}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {item.taskTimeOut}
                </td> */}
                <td className="py-3 px-4 text-gray-700">{item.taskDuration}</td>
                <td className="py-3 px-4 text-gray-700">{item.taskUpdate}</td>

                {/* <td className="py-3 px-4 text-gray-700">{item.taskUpdate}</td> */}
                {/* <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
                      item.taskStatusName
                    )}`}
                  >
                    {item.taskStatusName}
                  </span>
                </td> */}
                {/* <td className="py-3 px-4">
                  <div className="flex gap-3">
                    <Link
                      to={`/user/task-list/${item.taskAllocationId}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={24} />
                    </Link>
                    <FaEye
                      size={24}
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleEyeClick(item)}
                    />
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
  //#endregion
};

export default UserTaskNoteList;
//#endregion