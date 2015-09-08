import Relay from 'react-relay';

export default class ChangeTodoStatusMutation extends Relay.Mutation {
  static fragments = {
    // TODO: Mark numCompletedTodos optional.
    viewer: () => Relay.QL`
      fragment on User {
        id,
        todos {
          numCompletedTodos
        }
      }
    `,

    todo: () => Relay.QL`
      fragment on Todo {
        id
      }
    `
  };

  getMutation() {
    return Relay.QL`mutation{changeTodoStatus}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ChangeTodoStatusPayload {
        viewer {
          todos
        },
        todo {
          complete
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
        todo: this.props.todo.id
      }
    }];
  }

  getVariables() {
    return {
      id: this.props.todo.id,
      complete: this.props.complete
    };
  }

  getOptimisticResponse() {
    const {viewer, todo, complete} = this.props;
    let viewerPayload;

    if (viewer.todos) {
      viewerPayload = {
        id: viewer.id,
        todos: {}
      };

      const {numCompletedTodos} = viewer.todos;
      if (numCompletedTodos != null) {
        viewerPayload.todos.numCompletedTodos =
          numCompletedTodos + (complete ? 1 : -1);
      }
    }

    return {
      viewer: viewerPayload,
      todo: {
        id: todo.id,
        complete
      }
    };
  }
}
