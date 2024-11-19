import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { TaskService } from "../../service/TaskService"; // Make sure this is correctly imported
import { Link } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const result = await TaskService.getTasks();
        setTasks(result.data); // Set the 'data' array to the state
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]); // Fallback to an empty array in case of an error
      }
    };
    fetchTasks();
  }, []);


  // Function to set the color based on the task status
  const getStatusColor = (taskStatusName) => {
    switch (taskStatusName) {
      case "Pending":
        return "text-red-500 bg-red-100"; // Red for Pending
      case "Completed":
        return "text-green-500 bg-green-100"; // Green for Completed
      case "In Progress":
        return "text-yellow-500 bg-yellow-100"; // Yellow for In Progress
      default:
        return "text-gray-500 bg-gray-100"; // Default color
    }
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the date format as needed
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await TaskService.deleteTask(taskId);
      if (response.status === 1) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.taskAllocationId !== taskId)
        );
        alert(response.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Task List</h1>
        {/* You can add a button to create new tasks here if needed */}
        <Link
          to="/task/create-task"
          className="bg-[#0296D6] hover:bg-[#0074BD] flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
        >
          Add Task
          <FaPlus className="mt-[3px]" size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-900 border-b">
            <tr>
              {[
                "Task Name",
                "Assigned To",
                "Priority",
                "Starting Date",
                "Expected Completion Date",
                "Task Type",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((item) => (
              <tr key={item.taskAllocationId} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700">{item.taskName}</td>
                <td className="py-3 px-4 text-gray-700">{item.taskTaker}</td>
                <td className="py-3 px-4 text-gray-700">{item.taskPriority}</td>
                <td className="py-3 px-4 text-gray-700">{formatDate(item.taskStartingDate)}</td>
                <td className="py-3 px-4 text-gray-700">{formatDate(item.taskExpectedCompletionDate)}</td>
                <td className="py-3 px-4 text-gray-700">{item.taskType}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(item.taskStatusName)}`}
                  >
                    {item.taskStatusName} {/* Display human-readable status */}
                  </span>
                </td>
                <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Link to={`/task/edit-task/${item.taskAllocationId}`} className="text-blue-500 hover:text-blue-700">
                    <FaEdit size={24} />
                  </Link>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteTask(item.taskAllocationId)}
                  >
                    <FaTrash size={20} />
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TaskList;
