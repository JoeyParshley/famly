import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.GRAPHQL_SCHEMA_URL || 'http://localhost:3000/graphql',
  documents: 'src/**/*.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        dedupeFragments: true,
        scalars: {
          Date: 'string',
          DateTime: 'string',
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
