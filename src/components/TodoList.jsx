import { Droppable, Draggable } from "@hello-pangea/dnd";
import PropTypes from "prop-types";
import { TodoItem } from "./TodoItem";

export const TodoList = ({ todos, removeTodo, updateTodo, onEditTodo }) => {
  return (
    <Droppable droppableId="todos" innerRef={(ref) => {this.listRef = ref}}>
      {(droppableProvided) => (
        <div
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
          className="bg-white dark:bg-gray-800 mt-4 rounded-top overflow-hidden"
        >
          {todos.map((todo, index) => (
            <Draggable key={todo.id} index={index} draggableId={`${todo.id}`}>
              {(draggableProvided) => (
                <TodoItem
                  todo={todo}
                  removeTodo={removeTodo}
                  updateTodo={updateTodo}
                  onEditTodo={onEditTodo}
                  ref={draggableProvided.innerRef}
                  {...draggableProvided.dragHandleProps}
                  {...draggableProvided.draggableProps}
                />
              )}
            </Draggable>
          ))}
          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  removeTodo: PropTypes.func.isRequired,
  updateTodo: PropTypes.func.isRequired,
  onEditTodo: PropTypes.func.isRequired,
}
