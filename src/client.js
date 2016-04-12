import 'babel/polyfill';

import createHashHistory from 'history/lib/createHashHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { RelayRouter } from 'react-router-relay';
import RelayLocalSchema from 'relay-local-schema';
import { useRouterHistory } from 'rrtr';

import routes from './routes';
import schema from './data/schema';

import 'todomvc-common/base';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

import './assets/learn.json';

Relay.injectNetworkLayer(
  new RelayLocalSchema.NetworkLayer({ schema })
);

const history = useRouterHistory(createHashHistory)({ queryKey: false });

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

ReactDOM.render(
  <RelayRouter history={history} routes={routes} />,
  mountNode
);
