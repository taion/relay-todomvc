const getBabelRelayPlugin = require('babel-relay-plugin');

const schema = require('../src/data/schema.json');

module.exports = getBabelRelayPlugin(schema.data);
