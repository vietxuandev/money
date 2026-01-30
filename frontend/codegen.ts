import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        avoidOptionals: {
          field: true,
          inputValue: false,
        },
        withHooks: true,
        withHOC: false,
        withComponent: false,
        reactApolloVersion: 3,
        apolloReactHooksImportFrom: "@apollo/client/react",
        enumsAsTypes: true,
        constEnums: true,
        scalars: {
          DateTime: "string",
        },
        defaultScalarType: "unknown",
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
      },
    },
  },
  ignoreNoDocuments: true,
  require: "ts-node/register",
};

export default config;
