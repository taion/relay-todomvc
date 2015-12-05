import React from 'react';
import Relay from 'react-relay';
import {IndexLink, Link} from 'react-router';

import RemoveCompletedTodosMutation
  from '../mutations/RemoveCompletedTodosMutation';

class TodoListFooter extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  onClearCompletedClick = () => {
    const {viewer} = this.props;
    const {todos} = viewer;

    Relay.Store.update(
      new RemoveCompletedTodosMutation({viewer, todos})
    );
  };

  renderRemaining() {
    const {numTodos} = this.props.viewer;

    return (
      <span className="todo-count">
        <strong>
          {numTodos}
        </strong> {numTodos === 1 ? 'item' : 'items'} left
      </span>
    );
  }

  renderClearCompleted() {
    if (!this.props.viewer.numCompletedTodos) {
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
    if (!this.props.viewer.numTodos) {
      return null;
    }

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
  prepareVariables() {
    return {
      limit: -1 >>> 1
    };
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        todos(status: "completed", first: $limit) {
          ${RemoveCompletedTodosMutation.getFragment('todos')}
        },
        numTodos,
        numCompletedTodos,
        ${RemoveCompletedTodosMutation.getFragment('viewer')}
      }
    `
  }
});
