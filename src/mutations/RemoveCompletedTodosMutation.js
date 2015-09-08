import Relay from 'react-relay';

export default class RemoveCompletedTodosMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,

    // TODO: Make edges, numTodos, and numCompletedTodos optional.
    todos: () => Relay.QL`
      fragment on TodoConnection {
        edges {
          node {
            id,
            complete
          }
        },
        numTodos,
        numCompletedTodos
      }
    `
  };

  getMutation() {
    return Relay.QL`mutation{removeCompletedTodos}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveCompletedTodosPayload {
        viewer {
          todos {
            numTodos,
            numCompletedTodos
          },
        },
        deletedIds
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'todos',
      deletedIDFieldName: 'deletedIds'
    }];
  }

  getVariables() {
    return {};
  }

  getOptimisticResponse() {
    const {viewer, todos} = this.props;
    let newNumTodos;
    let deletedIds;

    if (todos) {
      const {numTodos, numCompletedTodos} = todos;
      if (numTodos != null && numCompletedTodos != null) {
        newNumTodos = numTodos - numCompletedTodos;
      }

      if (todos.edges) {
        deletedIds = todos.edges
          .filter(({node}) => node.complete)
          .map(({node}) => node.id);
      }
    }

    return {
      viewer: {
        id: viewer.id,
        todos: {
          numTodos: newNumTodos,
          numCompletedTodos: 0
        }
      },
      deletedIds
    };
  }
}
