import React from 'react';
import Relay from 'react-relay';
import IndexLink from 'react-router/lib/IndexLink';
import Link from 'react-router/lib/Link';

import RemoveCompletedTodosMutation
  from '../mutations/RemoveCompletedTodosMutation';

class TodoListFooter extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    todos: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
  };

  onClearCompletedClick = () => {
    const {viewer, todos} = this.props;

    Relay.Store.update(
      new RemoveCompletedTodosMutation({viewer, todos})
    );
  };

  renderRemaining() {
    const {numTodos} = this.props.todos;

    return (
      <span className="todo-count">
        <strong>
          {numTodos}
        </strong> {numTodos === 1 ? 'item' : 'items'} left
      </span>
    );
  }

  renderClearCompleted() {
    if (!this.props.todos.numCompletedTodos) {
      return null;
    }

    return (
      <button
        className="clear-completed"
        onClick={this.onClearCompletedClick}
      >
        Clear completed
      </button>
    );
  }

  render() {
    return (
      <footer className="footer">
        {this.renderRemaining()}

        <ul className="filters">
          <li>
            <IndexLink to="/" activeClassName="selected">All</IndexLink>
          </li>
          <li>
            <Link to="/active" activeClassName="selected">Active</Link>
          </li>
          <li>
            <Link to="/completed" activeClassName="selected">Completed</Link>
          </li>
        </ul>

        {this.renderClearCompleted()}
      </footer>
    );
  }
}

export default Relay.createContainer(TodoListFooter, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${RemoveCompletedTodosMutation.getFragment('viewer')}
      }
    `,
    todos: () => Relay.QL`
      fragment on TodoConnection {
        numTodos,
        numCompletedTodos,
        ${RemoveCompletedTodosMutation.getFragment('todos')}
      }
    `
  }
});
