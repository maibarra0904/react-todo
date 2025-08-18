import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import CrossIcon from "./icons/CrossIcon";
import { IconCheck } from "./icons/IconCheck";

const TodoItem = React.forwardRef(
  ({ todo, removeTodo, updateTodo, onEditTodo, ...props }, ref) => {
    const { id, completed, title } = todo;
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState(title);
    const inputRef = useRef(null);

    useEffect(() => {
      if (editing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [editing]);


    const handleEditClick = () => {
      setEditValue(title);
      setEditing(true);
    };

    const handleEditChange = (e) => {
      setEditValue(e.target.value);
    };

    const handleEditBlur = () => {
      if (editValue.trim() && editValue !== title) {
        onEditTodo(id, editValue.trim());
      }
      setEditing(false);
    };

    const handleEditKeyDown = (e) => {
      if (e.key === "Enter") {
        handleEditBlur();
      } else if (e.key === "Escape") {
        setEditing(false);
        setEditValue(title);
      }
    };

    return (
      <article
        {...props}
        ref={ref}
        className="d-flex align-items-center border-bottom border-1 border-secondary-subtle bg-white dark:bg-gray-800 px-3 py-2"
      >
        <button
          className={`btn btn-sm rounded-circle border me-3 ${completed ? 'btn-primary' : 'btn-outline-secondary'}`}
          style={{width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={() => updateTodo(id)}
        >
          {completed && <IconCheck />}
        </button>
        {editing ? (
          <input
            ref={inputRef}
            className="form-control flex-grow-1 me-2"
            style={{fontSize: '1.1rem'}}
            value={editValue}
            onChange={handleEditChange}
            onBlur={handleEditBlur}
            onKeyDown={handleEditKeyDown}
            maxLength={100}
          />
        ) : (
          <span
            className={`flex-grow-1 text-secondary-emphasis ${completed ? 'text-decoration-line-through' : ''}`}
            style={{fontSize: '1.1rem'}}
          >
            {title}
          </span>
        )}
        <button
          className="btn btn-link text-primary p-0 ms-2"
          onClick={handleEditClick}
          title="Editar tarea"
          tabIndex={0}
        >
          {/* Ícono lápiz SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.146.854a2.207 2.207 0 0 1 3.122 3.122l-10 10A.5.5 0 0 1 5 14H2.5a.5.5 0 0 1-.5-.5V11a.5.5 0 0 1 .146-.354l10-10zm1.415 1.415a1.207 1.207 0 0 0-1.707 0l-.793.793 1.707 1.707.793-.793a1.207 1.207 0 0 0 0-1.707zM11.5 3.207L3 11.707V13h1.293l8.5-8.5-1.293-1.293z"/>
          </svg>
        </button>
        <button className="btn btn-link text-danger p-0 ms-2" onClick={() => removeTodo(id)} title="Eliminar tarea">
          <CrossIcon />
        </button>
      </article>
    )
  }
);

TodoItem.displayName = "TodoItem";

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired,
  removeTodo: PropTypes.func.isRequired,
  updateTodo: PropTypes.func.isRequired,
  onEditTodo: PropTypes.func.isRequired,
};

export { TodoItem };
