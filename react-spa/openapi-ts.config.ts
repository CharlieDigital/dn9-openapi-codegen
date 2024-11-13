import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-axios',
  input: '../openapi-spec-c/api-spec.json',
  output: 'src/api',
});
