import { useState } from "react";

export const TodoCreate = ({createTodo}) => {

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');


  const handleSubmitAddTodo = (e) => {
    e.preventDefault();
    if(!title.trim()) {
      return setTitle('');
    }
    createTodo(title, dueDate);
    setTitle('');
    setDueDate('');
  }

  return (
    <form onSubmit={handleSubmitAddTodo} className="rounded-md overflow-hidden py-3 px-4 flex flex-col md:flex-row gap-3 items-center mt-4 mb-3 bg-white dark:bg-gray-800 transition-all duration-700">
      <div className="flex items-center gap-3 w-full">
        <span className="rounded-circle border border-2 d-inline-block flex-shrink-0" style={{height:'1.5rem', width:'1.5rem'}}></span>
        <input
          type="text"
          placeholder="Crear una nueva tarea..."
          className="form-control bg-transparent text-dark dark:text-light border-0 shadow-none p-0 flex-grow"
          style={{backgroundColor: 'transparent'}}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-muted dark:text-gray-400" style={{fontSize: '0.85rem', whiteSpace: 'nowrap'}}>Plazo:</span>
          <input
            type="date"
            className="form-control form-control-sm bg-gray-100 dark:bg-gray-700 text-dark dark:text-light border-0"
            style={{width: 'auto'}}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-sm btn-primary px-3 rounded-pill font-semibold">Agregar</button>
      </div>
    </form>
  );
};


import PropTypes from "prop-types";
TodoCreate.propTypes={
  createTodo: PropTypes.func.isRequired
}