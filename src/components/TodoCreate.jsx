import { useState } from "react";

export const TodoCreate = ({createTodo}) => {

  const [title, setTitle] = useState('');


  const handleSubmitAddTodo = (e) => {
    e.preventDefault();
    if(!title.trim()) {
      
      return setTitle('');
    }
    createTodo(title);
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmitAddTodo} className="rounded-md overflow-hidden py-4 px-4 flex gap-4 align-items-center mt-4 mb-3 bg-white dark:bg-gray-800 transition-all duration-700">
      <span className="rounded-circle border border-2 d-inline-block" style={{height:'1.5rem', width:'1.5rem'}}></span>
      <input
        type="text"
        placeholder="Create a new todo..."
        className="form-control bg-white dark:bg-gray-800 text-dark dark:text-light border-0 shadow-none"
        style={{backgroundColor: 'inherit'}}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
  );
};


import PropTypes from "prop-types";
TodoCreate.propTypes={
  createTodo: PropTypes.func.isRequired
}