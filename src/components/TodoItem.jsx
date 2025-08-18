import CrossIcon from "./icons/CrossIcon";
import { IconCheck } from "./icons/IconCheck";
import Comp from "react";

export const TodoItem = Comp.forwardRef(
  ({ todo, removeTodo, updateTodo, ...props }, ref) => {
    const { id, completed, title } = todo;
    return (
      <article
        {...props}
        ref={ref}
        className="flex gap-4 border-b border-b-gray-400 dark:bg-gray-800 transition-colors duration-700"
      >
        <button
          className={` h-5 w-5 flex-none  rounded-full border-2 ${
            completed
              ? "grid place-items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              : "inline-block"
          }`}
          onClick={() => updateTodo(id)}
        >
          {completed && <IconCheck />}
        </button>
        <p
          className={`grow text-gray-500 dark:text-gray-100 transition-colors duration-700 ${
            completed && "line-through"
          }`}
        >
          {title}
        </p>
        <button onClick={() => removeTodo(id)}>
          <CrossIcon />
        </button>
      </article>
    )
  }
)


TodoItem.propTypes = {
  todo: Function,
  removeTodo: Function,
  updateTodo: Function,
  
  ref: Function
};
