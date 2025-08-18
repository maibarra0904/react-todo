import { Droppable, Draggable } from "@hello-pangea/dnd";

import { TodoItem } from "./TodoItem";

export const TodoList = ({ todos, removeTodo, updateTodo }) => {
  return (
    <Droppable droppableId="todos" innerRef={(ref) => {this.listRef = ref}}>
      {(droppableProvided) => (
        <div
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
          className="bg-white mt-8 rounded-t-md overflow-hidden [&>article]:p-4 dark:bg-gray-800"
        >
          {todos.map((todo, index) => (
            <Draggable key={todo.id} index={index} draggableId={`${todo.id}`}>
              {(draggableProvided) => (
                <TodoItem

                  todo={todo}
                  removeTodo={removeTodo}
                  updateTodo={updateTodo}
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
  todos: Function,
  removeTodo: Function,
  updateTodo: Function,
};
