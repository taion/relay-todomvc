import Relay from 'react-relay';

export default class MarkAllTodosMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,

    // TODO: Mark edges and numTodos optional.
    todos: () => Relay.QL`
      fragment on TodoConnection {
        edges {
          node {
            id,
            complete
          },
        },
        numTodos
      }
    `
  };

  getMutation() {
    return Relay.QL`mutation{markAllTodos}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on MarkAllTodosPayload {
        viewer {
          todos
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id
      }
    }];
  }

  getVariables() {
    return {
      complete: this.props.complete
    };
  }

  getOptimisticResponse() {
    const {viewer, todos, complete} = this.props;
    let viewerPayload;

    if (todos) {
      viewerPayload = {
        id: viewer.id,
        todos: {}
      };

      if (todos.edges) {
        viewerPayload.todos.edges = todos.edges
          .filter(({node}) => node.complete !== complete)
          .map(({node}) => ({
            node: {
              id: node.id,
              complete
            }
          }));
      }

      const {totalCount} = todos;
      if (totalCount != null) {
        viewerPayload.todos.completedCount = complete ? totalCount : 0;
      }
    }

    return {
      viewer: viewerPayload
    };
  }
}
