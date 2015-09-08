import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import {
  Todo,
  User,
  addTodo,
  changeTodoStatus,
  getTodo,
  getTodos,
  getUser,
  getViewer,
  markAllTodos,
  removeCompletedTodos,
  removeTodo,
  renameTodo,
} from './database';

/* eslint-disable no-use-before-define */

const {nodeInterface, nodeField} = nodeDefinitions(
  globalId => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Todo') {
      return getTodo(id);
    } else if (type === 'User') {
      return getUser(id);
    }
  },
  obj => {
    if (obj instanceof Todo) {
      return GraphQLTodo;
    } else if (obj instanceof User) {
      return GraphQLUser;
    }
  }
);

const GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: globalIdField('Todo'),
    text: {
      type: GraphQLString,
      resolve: obj => obj.text
    },
    complete: {
      type: GraphQLBoolean,
      resolve: obj => obj.complete
    }
  },
  interfaces: [nodeInterface]
});

const {
  connectionType: TodosConnection,
  edgeType: GraphQLTodoEdge,
} = connectionDefinitions({
  name: 'Todo',
  nodeType: GraphQLTodo,
  connectionFields: () => ({
    numTodos: {
      type: GraphQLInt,
      resolve: conn => conn.edges.length
    },
    numCompletedTodos: {
      type: GraphQLInt,
      resolve: conn => conn.edges.filter(edge => edge.node.complete).length
    }
  })
});

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    todos: {
      type: TodosConnection,
      args: {
        complete: {type: GraphQLBoolean},
        ...connectionArgs
      },
      resolve: (obj, {complete, ...args}) =>
        connectionFromArray(getTodos(complete), args)
    }
  },
  interfaces: [nodeInterface]
});

const GraphQLRoot = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    node: nodeField
  }
});

const GraphQLAddTodoMutation = mutationWithClientMutationId({
  name: 'AddTodo',
  inputFields: {
    text: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    todoEdge: {
      type: GraphQLTodoEdge,
      resolve: ({todoId}) => {
        const todo = getTodo(todoId);
        return {
          cursor: cursorForObjectInConnection(getTodos(), todo),
          node: todo
        };
      }
    }
  },
  mutateAndGetPayload: ({text}) => {
    const todoId = addTodo(text);
    return {todoId};
  }
});

const GraphQLChangeTodoStatusMutation = mutationWithClientMutationId({
  name: 'ChangeTodoStatus',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    complete: {type: new GraphQLNonNull(GraphQLBoolean)}
  },
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    todo: {
      type: GraphQLTodo,
      resolve: ({todoId}) => getTodo(todoId)
    }
  },
  mutateAndGetPayload: ({id, complete}) => {
    const {id: todoId} = fromGlobalId(id);
    changeTodoStatus(todoId, complete);
    return {todoId};
  }
});

const GraphQLMarkAllTodosMutation = mutationWithClientMutationId({
  name: 'MarkAllTodos',
  inputFields: {
    complete: {type: new GraphQLNonNull(GraphQLBoolean)}
  },
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    changedTodos: {
      type: new GraphQLList(GraphQLTodo),
      resolve: ({changedTodoIds}) => changedTodoIds.map(getTodo)
    }
  },
  mutateAndGetPayload: ({complete}) => {
    const changedTodoIds = markAllTodos(complete);
    return {changedTodoIds};
  }
});

const GraphQLRemoveCompletedTodosMutation = mutationWithClientMutationId({
  name: 'RemoveCompletedTodos',
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    deletedIds: {
      type: new GraphQLList(GraphQLString),
      resolve: ({deletedIds}) => deletedIds
    }
  },
  mutateAndGetPayload: () => {
    const deletedTodoIds = removeCompletedTodos();
    const deletedIds = deletedTodoIds.map(toGlobalId.bind(null, 'Todo'));
    return {deletedIds};
  }
});

const GraphQLRemoveTodoMutation = mutationWithClientMutationId({
  name: 'RemoveTodo',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({id}) => id
    }
  },
  mutateAndGetPayload: ({id}) => {
    const {id: todoId} = fromGlobalId(id);
    removeTodo(todoId);
    return {id};
  }
});

const GraphQLRenameTodoMutation = mutationWithClientMutationId({
  name: 'RenameTodo',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    text: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    todo: {
      type: GraphQLTodo,
      resolve: ({todoId}) => getTodo(todoId)
    }
  },
  mutateAndGetPayload: ({id, text}) => {
    const {id: todoId} = fromGlobalId(id);
    renameTodo(todoId, text);
    return {todoId};
  }
});

const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTodo: GraphQLAddTodoMutation,
    changeTodoStatus: GraphQLChangeTodoStatusMutation,
    markAllTodos: GraphQLMarkAllTodosMutation,
    removeCompletedTodos: GraphQLRemoveCompletedTodosMutation,
    removeTodo: GraphQLRemoveTodoMutation,
    renameTodo: GraphQLRenameTodoMutation
  }
});

export default new GraphQLSchema({
  query: GraphQLRoot,
  mutation: GraphQLMutation
});
