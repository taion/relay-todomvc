import CopyWebpackPlugin from 'copy-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import server from './src/server';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';

import schema from './src/data/schema';

const PORT = 8080;

const app = express();

app.use('/graphql', graphQLHTTP({ schema }));
app.use(server);

const webpackConfig = {
  mode: 'development',

  entry: ['babel-polyfill', './src/client'],

  output: {
    path: '/',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      // See: https://github.com/aws/aws-amplify/issues/686#issuecomment-387710340
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([
      'src/assets',
      'node_modules/todomvc-common/base.css',
      'node_modules/todomvc-app-css/index.css',
    ]),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`[App] Listening on http://localhost:${PORT} \n`],
      },
    }),
  ],
};

app.use(
  webpackMiddleware(webpack(webpackConfig), {
    stats: { colors: true },
  }),
);

app.listen(PORT, () => {
  console.log(`Booting...`); // eslint-disable-line no-console
});
