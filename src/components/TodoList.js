import React from 'react';
import Relay from 'react-relay';

import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';

import Todo from './Todo';

class TodoList extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  onToggleAllChange = (e) => {
    const {viewer} = this.props;
    const {todos} = viewer;
    const complete = e.target.checked;

    Relay.Store.update(
      new MarkAllTodosMutation({viewer, todos, complete})
    );
  };

  renderTodos() {
    const {viewer} = this.props;

    return viewer.todos.edges.map(({node}) =>
      <Todo
        key={node.id}
        viewer={viewer}
        todo={node}
      />
    );
  }

  render() {
    const {numTodos, numCompletedTodos} = this.props.viewer.todos;
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

// In practice to optimally use the capacities of Relay's mutations, you'd use
// separate activeTodos and completedTodos connections and modify them
// separately in mutations. I'm using a single todos connection with a complete
// argument to demonstrate how to pass variables down from the route, though.

export default Relay.createContainer(TodoList, {
  initialVariables: {
    status: null
  },

  prepareVariables({status}) {
    let complete;

    if (status === 'active') {
      complete = false;
    } else if (status === 'completed') {
      complete = true;
    } else {
      complete = null;
    }

    return {complete};
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        todos(complete: $complete, first: 9007199254740991) {
          edges {
            node {
              id,
              ${Todo.getFragment('todo')}
            }
          }
          numTodos,
          numCompletedTodos,
          ${MarkAllTodosMutation.getFragment('todos')}
        },
        ${Todo.getFragment('viewer')},
        ${MarkAllTodosMutation.getFragment('viewer')}
      }
    `
  }
});
