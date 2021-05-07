const express = require('express');
const app = express();
const port = 3000;

if (process.env.NODE_ENV === 'production') {
  const path = require('path');

  app.use(express.static(__dirname + '/dist'));
} else {
  const webpack = require('webpack');
  const config = require('./webpack.config.js');
  const compiler = webpack(config);
  const middleware = require('webpack-dev-middleware');

  app.use(
    middleware(compiler, {
      publicPath: config.output.publicPath,
    })
  );
}

app.listen(port);
