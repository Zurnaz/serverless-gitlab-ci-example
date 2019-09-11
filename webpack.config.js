// webpack.config.js
const slsw = require('serverless-webpack')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
}
