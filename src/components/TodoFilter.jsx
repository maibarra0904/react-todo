export const TodoFilter = ({changeFilter, filter}) => {
  return (
    <section className="container my-3" style={{maxWidth: 600}}>
      <div className="bg-white dark:bg-gray-800 rounded p-3 d-flex justify-content-center">
        <div className="btn-group" role="group">
          <button className={`btn btn-outline-primary${filter === 'all' ? ' active' : ''}`} onClick={() => changeFilter('all')}>All</button>
          <button className={`btn btn-outline-primary${filter === 'active' ? ' active' : ''}`} onClick={() => changeFilter('active')}>Active</button>
          <button className={`btn btn-outline-primary${filter === 'completed' ? ' active' : ''}`} onClick={() => changeFilter('completed')}>Completed</button>
        </div>
      </div>
    </section>
  );
};

import PropTypes from "prop-types";
TodoFilter.propTypes={
  changeFilter: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired
}