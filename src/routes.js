import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';

import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';
import ViewerQueries from './queries/ViewerQueries';

export default (
  <Route
    path="/"
    component={TodoApp}
    queries={ViewerQueries}
  >
    <IndexRoute
      component={TodoList}
      queries={ViewerQueries}
      prepareParams={params => ({ ...params, status: 'any' })}
    />
    <Route
      path=":status"
      component={TodoList}
      queries={ViewerQueries}
    />
  </Route>
);
