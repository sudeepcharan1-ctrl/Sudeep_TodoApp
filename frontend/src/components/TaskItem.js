import React, { useState } from "react";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const saveEdit = async () => {
    if (!title.trim()) return;
    await onEdit(task.id, { title: title.trim(), description: description.trim() });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="task-item task-item-editing">
        <input
          className="task-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <input
          className="task-input task-input-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="task-actions">
          <button className="btn btn-primary" onClick={saveEdit}>Save</button>
          <button className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
        </div>
      </li>
    );
  }

  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="checkmark" />
      </label>

      <div className="task-body">
        <p className="task-title">{task.title}</p>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>

      <div className="task-actions">
        <button className="btn btn-ghost" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}
