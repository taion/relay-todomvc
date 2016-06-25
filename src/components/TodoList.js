import React from 'react';
import Relay from 'react-relay';

import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';
import Todo from './Todo';

class TodoList extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object.isRequired,
  };

  onToggleAllChange = (e) => {
    const { relay, viewer } = this.props;
    const { todos } = viewer;
    const complete = e.target.checked;

    relay.commitUpdate(
      new MarkAllTodosMutation({ viewer, todos, complete })
    );
  };

  renderTodos() {
    const { viewer } = this.props;

    return viewer.todos.edges.map(({ node }) => (
      <Todo
        key={node.id}
        viewer={viewer}
        todo={node}
      />
    ));
  }

  render() {
    const { numTodos, numCompletedTodos } = this.props.viewer;
    if (!numTodos) {
      return null;
    }

    return (
      <section className="main">
        <input
          type="checkbox"
          checked={numTodos === numCompletedTodos}
          className="toggle-all"
          onChange={this.onToggleAllChange}
        />
        <label htmlFor="toggle-all">
          Mark all as complete
        </label>

        <ul className="todo-list">
          {this.renderTodos()}
        </ul>
      </section>
    );
  }
}

export default Relay.createContainer(TodoList, {
  initialVariables: {
    status: null,
    limit: -1 >>> 1,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        todos(status: $status, first: $limit) {
          edges {
            node {
              id
              ${Todo.getFragment('todo')}
            }
          }
          ${MarkAllTodosMutation.getFragment('todos')}
        }
        numTodos
        numCompletedTodos
        ${Todo.getFragment('viewer')}
        ${MarkAllTodosMutation.getFragment('viewer')}
      }
    `,
  },
});
