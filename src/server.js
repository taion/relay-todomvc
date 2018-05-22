import express from 'express';
import { getFarceResult } from 'found/lib/server';
import { Resolver } from 'found-relay';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';

import { createRelayEnvironment } from './relayEnvironment';
import { historyMiddlewares, render, routeConfig } from './router';

const app = express();

app.get('/', async (req, res) => {
  try {
    const environment = createRelayEnvironment();
    const resolver = new Resolver(environment);

    const { redirect, status, element } = await getFarceResult({
      url: req.url,
      historyMiddlewares,
      routeConfig,
      resolver,
      render,
    });

    if (redirect) {
      res.redirect(302, redirect.url);
      return;
    }

    ReactDOMServer.renderToString(element);
    const relayData = await environment.relaySSRMiddleware.getCache();

    setTimeout(() => {
      const html = ReactDOMServer.renderToString(element);

      res.status(status).send(`
      <!DOCTYPE html>
      <html>

      <head>
        <meta charset="utf-8">
        <title>Relay • TodoMVC</title>
        <link rel="stylesheet" href="base.css">
        <link rel="stylesheet" href="index.css">
      </head>

      <body>
      <div id="root">${html}</div>

      <script>
        window.__RELAY_PAYLOADS__ = ${serialize(JSON.stringify(relayData), {
          isJSON: true,
        })};
      </script>
      <script src="/bundle.js"></script>
      </body>

      </html>
    `);
    }, 0);
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
});

export default app;
