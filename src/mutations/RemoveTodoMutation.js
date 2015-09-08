import Relay from 'react-relay';

export default class RemoveTodoMutation extends Relay.Mutation {
  static fragments = {
    // TODO: Mark numTodos and numCompletedTodos as optional.
    viewer: () => Relay.QL`
      fragment on User {
        id,
        todos {
          numTodos,
          numCompletedTodos
        }
      }
    `,

    // TODO: Mark complete as optional.
    todo: () => Relay.QL`
      fragment on Todo {
        id,
        complete
      }
    `
  };

  getMutation() {
    return Relay.QL`mutation{removeTodo}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveTodoPayload {
        viewer {
          todos {
            numTodos,
            numCompletedTodos
          },
        },
        deletedId
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'todos',
      deletedIDFieldName: 'deletedId'
    }];
  }

  getVariables() {
    return {
      id: this.props.todo.id
    };
  }

  getOptimisticResponse() {
    const {viewer, todo} = this.props;
    let viewerPayload;

    if (viewer.todos) {
      viewerPayload = {
        id: viewer.id,
        todos: {}
      };

      const {numTodos, numCompletedTodos} = viewer.todos;
      if (numTodos != null) {
        viewerPayload.todos.numTodos = numTodos - 1;
      }
      if (numCompletedTodos != null) {
        viewerPayload.todos.numCompletedTodos =
          numCompletedTodos - (todo.complete ? 1 : 0);
      }
    }

    return {
      viewer: viewerPayload,
      deletedId: todo.id
    };
  }
}
