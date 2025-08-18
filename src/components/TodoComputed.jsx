export const TodoComputed = ({computedItemsLeft, computedItemsCompleted, clearCompleted}) => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-bottom p-3 d-flex justify-content-between align-items-center">
      <span className="text-secondary">{computedItemsLeft} items left</span>
      <span className="text-secondary">{computedItemsCompleted} items completed</span>
      <button className="btn btn-link text-danger p-0" onClick={clearCompleted}>Clear completed</button>
    </section>
  );
};

import PropTypes from "prop-types";
TodoComputed.propTypes={
  computedItemsLeft: PropTypes.number.isRequired,
  clearCompleted: PropTypes.func.isRequired,
  computedItemsCompleted: PropTypes.number.isRequired
}