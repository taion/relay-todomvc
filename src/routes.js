import React from 'react';
import {Route} from 'react-router';

import ViewerQueries from './queries/ViewerQueries';

import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';

export default (
  <Route
    component={TodoApp}
    queries={ViewerQueries}
  >
    <Route
      path="/" component={TodoList}
      queries={ViewerQueries}
      queryParams={['status']} // Inject the status param to trigger re-fetch.
    />
    <Route
      path="/:status" component={TodoList}
      queries={ViewerQueries}
    />
  </Route>
);
