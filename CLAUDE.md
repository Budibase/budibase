# Budibase Agent Guide

## Architecture

- Workspace uses Lerna monorepo with packages in `packages/`
- Main packages: server, worker, backend-core, frontend-core, client, builder, shared-core, bbui
- Use `@budibase/` scoped imports between packages
- Backend packages (NodeJS): server, worker, backend-core
- Frontend packages (browser): builder, frontend-core, bbui
- Shared (NodeJS and browser): shared-core

## Build/Test Commands

- Build: `yarn build`
- Lint: `yarn lint` (check) or `yarn lint:fix` (fix)
- Test: `yarn test <filename>` run inside of a packages/\* directory
- Type check: `yarn check:types`
- packages/server tests: if you're working on a test that uses the
  `datasourceDescribe` function, that means you can pass `DATASOURCE=` as an env
  var to the test to narrow it down to one specific database. The database strings
  you can use can be found on `DatabaseName` in `packages/server/src/integrations/tests/utils/index.ts`

## Code Style

- No semicolons, double quotes, 2-space tabs (see .prettierrc.json)
- Use TypeScript strict mode with consistent-type-imports
- Imports: Group external imports first, then internal `@budibase/*` packages
- Variables: camelCase, prefix unused with `_`
- Functions: Prefer arrow functions, use async/await over Promises
- Error handling: Use try/catch
- Types: Use `interface` for objects, `type` for unions/primitives
- Testing: Jest framework, use describe/it structure, mock external services
  using `nock`.
- Only comment when it's really necessary to explain an unclear behaviour.
- Never use console.log in tests, the output will not be visible in STDOUT
  when you run the tests. It is a waste of time.
- In application code use console.log instead of pino the logging framework.
  We have made it so that console.log statements are redirected to pino.
- When you're writing tests, you don't need to assert or do conditional checks
  on intermediate states. Just assert the final outcome
  against, provided there are no type errors.

## Test style - packages/server

- When building automations utilise the `createAutomationBuilder` function
  found in `packages/server/src/automations/tests/utilities/AutomationTestBuilder.ts`
- When building tables, datasources, queries and various other Budibase resources check for functions like `basicTable`
  found in `packages/server/src/tests/utilities/structures.ts` - use these to create a basic table, you can provide
  extended configuration if required through the `extra` prop.
- Use `TestConfiguration` in `packages/server/src/tests/TestConfiguration.ts` for every API test case - 
  this can be used to access the test API under `new TestConfiguration().api`, a list of functions and 
  request/response types can be found in `packages/server/src/tests/utilities/api`.

## Pull requests

- Always respect the format of pull_request_template.md. Some sections may not
  be required, you are free to ignore them. Don't add new sections, though.
- When you open a pull request, always open it as a draft so that it can be
  reviewed by a human.
- Before opening a pull request, always make sure that the branch you're pushing
  is up to date with master.
- If you're working on a bug, the name of the PR should start with the bug ID
  in square brackets, e.g. [BUDI-1234]. The link to the bug should go into the
  "Addresses" section of pull_request_template.md.

## Browser use

- If you're browsing the Budibase product in a browser, you can find
  comprehensive documentation at https://docs.budibase.com
- The local URL for the development server is http://localhost:10000. Before
  running `yarn dev`, check to see if the development server is already running.
- The default login for local development is email "local@budibase.com" and
  password "cheekychuckles".
- The product is split up by app, so to find things like data sources and
  automations you must first make sure to select an app.

## Misc

- When creating or switching branches, make sure the branch is up to date with
  the remote on GitHub. Don't work on old code.
