# Coding Conventions

**Analysis Date:** 2026-03-21

## Naming Patterns

**Files:**
- kebab-case for most files: `authorized.ts`, `joi-validator.ts`, `workspaceMigrations.ts`
- Camel case for utility/service files: `structures.ts`, `helpers.ts`
- Index files: `index.ts` for barrel exports in key directories like `src/sdk/index.ts`, `src/db/index.ts`, `src/api/index.ts`
- Test files: Use `.spec.ts` suffix: `workspaceMigrations.spec.ts`, `activation.spec.ts`

**Functions:**
- camelCase for all function names: `skipMigrationRedirect()`, `checkAuthorized()`, `prioritisedArraySort()`
- Prefer arrow functions over function declarations: `const authorized = (...) => async (ctx, next) => {}`
- Private/internal functions use camelCase: `checkAuthorizedResource()`, `getBaseLimit()`
- Factory functions return higher-order functions: `authorized()` returns middleware function

**Variables:**
- camelCase for all variable names: `resourceRoles`, `userRoles`, `permError`, `envLimit`
- Prefix unused parameters/variables with underscore: `_`, example `argsIgnorePattern: "^_"` in eslint config
- Constants in UPPER_SNAKE_CASE: `DEFAULT_WORKSPACE_NAME`, `WEBHOOK_ENDPOINTS`, `COUNT_FIELD_NAME`, `MOCK_REDIS`

**Types:**
- PascalCase for type names: `UserCtx`, `AutomationTrigger`, `AutomationStep`, `SearchFilters`
- Use `interface` for object shapes, `type` for unions/primitives
- No type casting to `any` — use strict TypeScript with proper typing

## Code Style

**Formatting:**
- Prettier (`.prettierrc.json`):
  - 2-space indentation: `"tabWidth": 2`
  - No semicolons: `"semi": false`
  - Double quotes: `"singleQuote": false`
  - Trailing commas ES5: `"trailingComma": "es5"`
  - No arrow parens for single params: `"arrowParens": "avoid"`
  - Prettier Svelte plugin: `"plugins": ["prettier-plugin-svelte"]`

**Linting:**
- ESLint with TypeScript support (`eslint.config.mjs`):
  - Strict mode: `typescript-eslint/configs.strict`
  - No var declarations: Error on `no-var`
  - No console.log in frontend/builder packages (allow warn/error/debug)
  - Custom local rules enforced:
    - `local-rules/no-barrel-imports`: Prohibits importing from barrel files
    - `local-rules/no-budibase-imports`: Enforces `@budibase/` scoped imports between packages
    - `local-rules/no-console-error`: Prevents `console.error` (use console.log)
  - No unused variables unless prefixed with underscore

## Import Organization

**Order (in descending priority):**
1. External imports (Node.js, npm packages): `import { tmpdir } from "os"`, `import { knex } from "knex"`
2. Scoped Budibase imports: `import { context, db, roles } from "@budibase/backend-core"`, `import { User } from "@budibase/types"`
3. Relative imports: `import { cleanupAutomations } from "../../automations/utils"`

**Path Aliases:**
- `@budibase/backend-core`: Backend utilities and core functionality
- `@budibase/shared-core`: Code used in both Node.js and browser
- `@budibase/types`: Type definitions
- `@budibase/pro`: Pro features
- Destructure imports: `import { x, y, z } from "module"` rather than importing full modules

**No Barrel Imports:**
- Lint rule `local-rules/no-barrel-imports` prevents `import * from "./index"` and `import { x } from "."` (must be explicit paths)

## Error Handling

**Patterns:**
- Use `try/catch` for async operations: Standard error catching approach
- Koa middleware context errors: `ctx.throw(statusCode, message)` — returns HTTP error to client
  - Example: `ctx.throw(403, "Not Authorized")`, `ctx.throw(401, "No user info found")`
- Throw errors directly in non-middleware: `throw err` for re-throwing
- Conditional error handling: Check for specific error scenarios before catching

**Middleware Example** (from `authorized.ts`):
```typescript
try {
  await checkAuthorized(ctx, resourceRoles, permType, permLevel!)
} catch (err) {
  if (opts && opts.schema && permLevel) {
    await checkAuthorized(ctx, otherLevelRoles, permType, otherLevel)
  } else {
    throw err
  }
}
```

## Logging

**Framework:** `console.log` in application code
- Note: `console.log` statements are redirected to pino logging framework at runtime
- Use `console.error` for error logging in frontend/builder (backend uses console.log)
- No `console.log` in tests — output is not visible in STDOUT

**Patterns:**
- Log important state changes and API interactions
- Use console.log: `console.log("message")`
- Use console.error: `console.error("error message")` in frontend/builder packages only

## Comments

**When to Comment:**
- Only when behavior is unclear or non-obvious
- Avoid commenting obvious code
- Use single-line comments for clarification

**JSDoc/TSDoc:**
- Not consistently used — add when documenting complex functions
- Keep focused on explaining the "why" not the "what"

**Example** (from workspace.ts):
```typescript
// webhooks don't need authentication, each webhook unique
// also internal requests (between services) don't need authorized
if (isWebhookEndpoint(ctx) || ctx.internal) {
  return next()
}
```

## Function Design

**Size:**
- Aim for focused functions with single responsibility
- Example: `checkAuthorized()`, `checkAuthorizedResource()` — split concerns
- Helper functions break down complex logic (e.g., `getBaseLimit()`, `getRelationshipLimit()`)

**Parameters:**
- Type all parameters with TypeScript (no `any`)
- Destructure objects when possible
- Use options objects for optional parameters: `opts = { schema: false }`

**Return Values:**
- Explicit return types for functions
- Async functions return Promises
- Higher-order functions return functions: `(ctx, next) => { ... }`

**Example** (from authorized.ts):
```typescript
const authorized =
  (
    permType: PermissionType,
    permLevel?: PermissionLevel,
    opts = { schema: false },
    resourcePath?: string
  ) =>
  async (ctx: UserCtx, next: any) => {
    // implementation
  }
```

## Module Design

**Exports:**
- Named exports preferred: `export const authorizedMiddleware = (...)`
- Barrel files (`index.ts`) re-export from modules for public APIs: `src/sdk/index.ts`
- Default exports used for simple modules

**Barrel Files:**
- Strategic use in key directories: `src/sdk/`, `src/api/`, `src/db/`
- Central aggregation point for package exports
- Linting rule prevents importing from barrel files in source code (for better tree-shaking)

**Example** (index.ts pattern):
```typescript
// src/sdk/index.ts re-exports key modules for public API
export const authorizedMiddleware = (...) => { ... }
```

## Monorepo Patterns

**Package Organization:**
- Backend packages: `server`, `worker`, `backend-core` (Node.js)
- Frontend packages: `builder`, `frontend-core`, `bbui` (browser)
- Shared packages: `shared-core` (browser + Node.js), `types`, `string-templates`
- Use `@budibase/` scoped imports between packages: `import { x } from "@budibase/backend-core"`

**Type Imports:**
- Use `consistent-type-imports` rule: `import type { X }` for types
- Reduces runtime bundle size by excluding type imports

---

*Convention analysis: 2026-03-21*
