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
    <form onSubmit={handleSubmitAddTodo} className="dark:bg-gray-800 bg-white rounded-md overflow-hidden py-4 px-4 flex gap-4 items-center mt-8 transition-all duration-700">
      <span className="rounded-full h-5 w-5 border-2 inline-block"></span>
      <input
        type="text"
        placeholder="Create a new todo..."
        className="w-full text-gray-400 outline-none dark:bg-gray-800 transition-all duration-700"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
  );
};


TodoCreate.propTypes={
  createTodo: Function
}