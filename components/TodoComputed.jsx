export const TodoComputed = ({computedItemsLeft, computedItemsCompleted, clearCompleted}) => {
  return (
    <section className="py-4 px-4 flex justify-between bg-white rounded-b-md dark:bg-gray-800 transition-all duration-700">
      <span className="text-gray-400">{computedItemsLeft} items left</span>
      <span className="text-gray-400">{computedItemsCompleted} items completed</span>
      <button className="text-gray-400 hover:text-red-500" onClick={clearCompleted}>Clear completed</button>
    </section>
  );
};

TodoComputed.propTypes={
  computedItemsLeft: Function,
  clearCompleted: Function,
  computedItemsCompleted: Function
}