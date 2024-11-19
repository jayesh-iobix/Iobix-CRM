import React, { useState } from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(editedText);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggleComplete}
          className="w-5 h-5"
        />
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="p-1 border rounded"
          />
        ) : (
          <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.text}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleEdit}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button
          onClick={onDelete}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
