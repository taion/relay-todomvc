import getBabelRelayPlugin from 'babel-relay-plugin';

import schema from '../src/data/schema.json';

export default getBabelRelayPlugin(schema.data);
