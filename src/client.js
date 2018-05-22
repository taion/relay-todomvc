import BrowserProtocol from 'farce/lib/BrowserProtocol';
import createInitialFarceRouter from 'found/lib/createInitialFarceRouter';
import { Resolver } from 'found-relay';
import React from 'react';
import ReactDOM from 'react-dom';

import { createRelayEnvironment } from './relayEnvironment';
import { historyMiddlewares, render, routeConfig } from './router';

import 'todomvc-common/base';

(async () => {
  const environment = createRelayEnvironment(window.__RELAY_PAYLOADS__); // eslint-disable-line
  const resolver = new Resolver(environment);

  const Router = await createInitialFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares,
    routeConfig,
    resolver,
    render,
  });

  ReactDOM.hydrate(
    <Router resolver={resolver} />,
    document.getElementById('root'),
  );
})();
