import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const production = process.env.NODE_ENV === 'production';

export default {
  entry: './src/client',
  output: {
    path: './build',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /learn\.json$/, loader: 'file?name=[name].[ext]' },
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) },
    }),
    new HtmlWebpackPlugin({
      title: 'Relay • TodoMVC',
    }),
  ],
  devtool: production ? 'source-map' : 'eval-source-map',
  devServer: {
    contentBase: './build',
  },
};
