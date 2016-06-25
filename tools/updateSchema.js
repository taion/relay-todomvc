import fs from 'fs';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';
import path from 'path';

import schema from '../src/data/schema';

(async () => {
  const result = await graphql(schema, introspectionQuery);
  if (result.errors) {
    throw new Error(result.errors);
  }

  fs.writeFileSync(
    path.join(__dirname, '../src/data/schema.json'),
    JSON.stringify(result, null, 2)
  );
})();

fs.writeFileSync(
  path.join(__dirname, '../src/data/schema.graphql'),
  printSchema(schema)
);
