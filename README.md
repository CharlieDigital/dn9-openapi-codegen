# .NET 9 OpenAPI + TypeScript Client Generation

A quick look at .NET 9's new OpenAPI tooling and how it compares to earlier versions of .NET using the `swagger` CLI tool (`Swashbuckle.AspNetCore.Cli`).

> ℹ️ Fork or clone to play with this yourself and explore how it improves/digresses from Swashbuckle CLI

https://github.com/user-attachments/assets/805d961d-1d03-4933-b045-92e3bb85ef4a

Layout:

```
/api-c              Controller API example
/api                Minimal API example
/openapi-spec-c     Controller API OpenAPI spec output target
/openapi-spec       Minimal API OpenAPI spec output target
/react-spa          React SPA generating a TypeScript client using the /api-c output
/vue-spa            Vue SPA generating a TypeScript client using the /api output
```

## Setup the Project

```bash
# Create the workspace
mkdir dn9-openapi-codgen

# Create the .NET 9 web app
dn9-openapi-codgen
dotnet new webapi -minimal -f net9.0

# Create the SPA (Vue) or your framework of choice
cd ../
mkdir vue-spa
cd vue-spa
yarn create vite .
```

> ⚠️ IMPORTANT NOTE: Like the earlier Swashbuckle tooling, this new tooling starts the server to generate the OpenAPI spec.  This means that your startup code will be invoked.  Be aware of this if your startup code requires "active" components and replace it with a mock/stub that gets loaded/used when you see a flag (see the next section where we add an environment variable called `GEN` for this purpose to indicate that we are in a code generation context).

## Setup the .NET Web API Project

Add the following package:

```bash
dotnet add package Microsoft.Extensions.ApiDescription.Server
```

Now update the `.csproj` file to include the following:

```xml
<!--
  api/api.csproj
-->
<!--
  This property group contains the directives for generating the
  OpenAPI specification.
-->
<PropertyGroup>
  <!-- The output directory (placed one level up in this case) -->
  <OpenApiDocumentsDirectory>../openapi-spec</OpenApiDocumentsDirectory>
  <!-- The file name -->
  <OpenApiGenerateDocumentsOptions>--file-name api-spec</OpenApiGenerateDocumentsOptions>
</PropertyGroup>
```

Now build and verify the `/openapi-spec/api-spec.json` file is created.

For more details, [see this doc](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/aspnetcore-openapi?view=aspnetcore-9.0).

Now we can pull these into our front-end projects.

## Configuring the Vue SPA

We'll use the [Hey API](https://heyapi.dev/) package with Axios.

```bash
cd vue-spa
yarn add @hey-api/client-axios && yarn add @hey-api/openapi-ts -D
```

Then update the `package.json` to add our build command.

```json
// vue-spa/package.json
"scripts": {
  "gen": "openapi-ts"
}
```

And now create a root level file `openapi-ts.config.ts`:

```js
// vue-spa/openapi-ts.config.ts
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-axios',
  input: '../openapi-spec/api-spec.json',
  output: 'src/api',
});
```

Now we can manually test generate a client

```bash
# vue-spa
yarn gen
```

## Generate on Build

If we want to generate on build of our .NET project, we need to set up a hook in our `.csproj`

```xml
<!-- api/api.csproj -->

<!-- This section is a set of post-build commands -->
<Target Name="GenerateSpec" AfterTargets="Build" Condition="$(Configuration)=='Gen' Or $(GEN)=='true'">
  <Message Text="Generating OpenAPI schema file." Importance="high" />

  <!-- Generate TS bindings for the web app -->
  <Exec Command="yarn gen" WorkingDirectory="../vue-spa" />
</Target>
```

We trigger this manually using:

```bash
# macOS, Linux
GEN=true dotnet build

# macOS, Linux, Windows
dotnet build --configuration Gen
```

(Feel free to remove this constraint if you want it to always generate)

We can also make this work for hot reloads (see the video at the top):

```bash
# macOS, Linux
GEN=true dotnet watch build --non-interactive

# macOS, Linux, Windows
dotnet watch build --non-interactive --property:Configuration=Gen
```

For convenience, you might consider putting this into a script called `_watch.sh`.

## Controller Based APIs

This also works more or less the same way with controller APIs:

```bash
# Make a new directory and project with the controller API
mkdir api-c
cd api-c
dotnet new webapi --use-controllers --no-https -f net9.0

# Add the project to the solution (for intellisense)
cd ../
dotnet sln add api-c
```

This example generates a client for the `react-spa` app.

## Downsides

Big downside from earlier Swagger tooling is that there does not appear to be a way to automatically incorporate the XML document comments into the output schema.

This is accomplished by [metadata attributes](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/include-metadata?view=aspnetcore-9.0&tabs=minimal-apis).

(Boooooo!)

This will probably be overcome in time by someone taking the initiative to create [a transformer](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/customize-openapi?view=aspnetcore-9.0) that will pull in descriptions.
