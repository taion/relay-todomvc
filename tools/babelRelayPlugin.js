import getBabelRelayPlugin from 'babel-relay-plugin';
import schema from '../src/data/schema.json';

module.exports = getBabelRelayPlugin(schema.data);
