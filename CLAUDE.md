# Budibase Agent Guide

## Build/Test Commands

- Build: `yarn build` (all packages) or `yarn build:apps` (server/worker only)
- Lint: `yarn lint` (check) or `yarn lint:fix` (fix)
- Test: `yarn test <filename>` run inside of a packages/\* directory
- Type check: `yarn check:types`

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

## Pull requests

- Always sespect the format of pull_request_template.md. Some sections may not
  be required, you are free to ignore them. Don't add new sections, though.
- When you open a pull request, always open it as a draft so that it can be
  reviewed by a human.
- Before opening a pull request, always make sure that the branch you're pushing
  is up to date with master.

## Architecture

- Workspace uses Lerna monorepo with packages in `packages/`
- Main packages: server, worker, backend-core, frontend-core, client, builder
- Use `@budibase/` scoped imports between packages

## Misc

- When creating or switching branches, make sure the branch is up to date with
  the remote on GitHub. Don't work on old code.
