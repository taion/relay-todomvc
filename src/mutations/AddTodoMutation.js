import Relay from 'react-relay';

// Unlike in the upstream example, this has to re-fetch the entire list of
// todos, because we don't have separate connections for active and completed
// todos.

export default class AddTodoMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        todos {
          numTodos
        }
      }
    `
  };

  getMutation() {
    return Relay.QL`mutation{addTodo}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddTodoPayload {
        viewer {
          todos
        },
        todoEdge
      }
    `;
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id
        }
      },
      {
        type: 'RANGE_ADD',
        parentName: 'viewer',
        parentID: this.props.viewer.id,
        connectionName: 'todos',
        edgeName: 'todoEdge',
        rangeBehaviors: {
          '': 'append'
        }
      }
    ];
  }

  getVariables() {
    return {
      text: this.props.text
    };
  }

  getOptimisticResponse() {
    const {viewer, text} = this.props;

    return {
      viewer: {
        id: viewer.id,
        todos: {
          numTodos: viewer.todos.numTodos + 1
        }
      },

      // FIXME: numTodos gets updated optimistically, but this edge does not
      // get added until the server responds.
      todoEdge: {
        node: {
          complete: false,
          text
        }
      }
    };
  }
}
