# Testing Patterns

**Analysis Date:** 2026-03-21

## Test Framework

**Runner:**
- Jest for server/backend packages: `packages/server/`, `packages/backend-core/`, `packages/worker/`, `packages/shared-core/`
- Config: `jest.config.ts` in each package (TypeScript config with @swc/jest transformer)
- Example: `packages/server/jest.config.ts`, `packages/backend-core/jest.config.ts`

**Assertion Library:**
- Jest built-in assertions: `expect(result).toBe(value)`, `expect(result).toHaveBeenCalled()`
- Jest Extended matchers: `expect.extend(matchers)` in `packages/server/src/tests/jestSetup.ts`
  - Adds utilities like `.toBeEmpty()`, etc.

**Run Commands:**
```bash
cd packages/server && yarn test <filename>     # Run specific test file
cd packages/backend-core && yarn test <filename> # Run tests in package
yarn test                                       # Run all tests in package (from within package dir)
DATASOURCE=<database_name> yarn test <file>    # Run server tests with specific datasource
```

**Coverage:**
```bash
yarn test --coverage                           # Generate coverage reports
# Reports: lcov, json, clover formats in coverage/ directory
```

## Test File Organization

**Location:**
- Co-located with source code in same directory
- Nested `tests/` subdirectories for complex modules
- Examples:
  - `packages/server/src/middleware/tests/workspaceMigrations.spec.ts` (in subdirectory)
  - `packages/server/src/automations/tests/triggers/rowUpdated.spec.ts` (nested)
  - `packages/server/src/tests/api/chatApps.spec.ts` (separate tests directory)

**Naming:**
- `.spec.ts` suffix: `workspaceMigrations.spec.ts`, `activation.spec.ts`, `contentSecurityPolicy.spec.ts`
- Match source file name when co-located

**Structure:**
```
packages/server/src/
├── middleware/
│   ├── authorized.ts
│   └── tests/
│       └── authorized.spec.ts
├── tests/
│   ├── api/
│   │   ├── chatApps.spec.ts
│   │   └── rowExternal.spec.ts
│   ├── utilities/
│   │   ├── TestConfiguration.ts
│   │   ├── structures.ts
│   │   └── api/
│   └── integrations/
│       └── utils.spec.ts
```

## Test Structure

**Suite Organization:**
```typescript
describe("middleware name", () => {
  describe("specific function", () => {
    beforeEach(() => {
      // Setup before each test
    })

    afterEach(() => {
      // Cleanup after each test (if needed)
    })

    it("should do something", async () => {
      // Test implementation
    })
  })
})
```

**Patterns:**
- `describe()`: Group related tests into logical suites
- `beforeEach()`: Reset mocks and setup state before each test
- `afterEach()`: Cleanup (when needed)
- `beforeAll()`: One-time setup for all tests in suite (e.g., initialize TestConfiguration)
- `afterAll()`: One-time cleanup for entire suite (e.g., `config.end()`)
- `it()`: Individual test cases with clear descriptions

**Example** (from workspaceMigrations.spec.ts):
```typescript
describe("workspaceMigrations middleware", () => {
  describe("skipMigrationRedirect", () => {
    let ctx: UserCtx

    beforeEach(() => {
      jest.clearAllMocks()
      const responseMap = new Map()
      ctx = {
        response: {
          set: (key: string, value: string) => responseMap.set(key, value),
          get: (key: string) => responseMap.get(key),
          remove: (key: string) => responseMap.delete(key),
        },
      } as any
    })

    it("should return next result when header not present", async () => {
      const next = jest.fn().mockResolvedValue("next-result")
      const result = await skipMigrationRedirect(ctx, next)

      expect(ctx.response.get(Header.MIGRATING_APP)).toBeUndefined()
      expect(next).toHaveBeenCalledTimes(1)
      expect(result).toBe("next-result")
    })
  })
})
```

## Mocking

**Framework:** Jest mocking + nock for HTTP
- `jest.mock()`: Mock entire modules
- `jest.fn()`: Create mock functions
- `jest.spyOn()`: Spy on existing methods
- `nock`: Mock HTTP requests (installed in `jestSetup.ts`)
- `undici` MockAgent: HTTP mocking for modern fetch APIs

**Patterns:**

**Module Mocking** (from activation.spec.ts):
```typescript
jest.mock("../../configs", () => ({
  getConfig: jest.fn(),
}))

const mockGetConfig = configs.getConfig as jest.MockedFunction<
  typeof configs.getConfig
>
```

**Function Mocking** (from workspaceMigrations.spec.ts):
```typescript
const next = jest.fn().mockResolvedValue("next-result")
const consoleSpy = jest.spyOn(console, "log").mockImplementation()

// Test
expect(next).toHaveBeenCalledTimes(1)
expect(consoleSpy).toHaveBeenCalledWith("Skipping migration redirect")

// Cleanup
consoleSpy.mockRestore()
```

**HTTP Mocking** (jestEnv.ts):
```typescript
import nock from "nock"

// Disable all external HTTP by default, allow localhost only
nock.disableNetConnect()
nock.enableNetConnect(host => {
  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("::1")
  )
})
```

**What to Mock:**
- External services (APIs, databases if using separate test DB)
- Environment dependencies
- System calls

**What NOT to Mock:**
- Internal code being tested
- Database operations (use real test database)
- Core business logic

**Setup Utilities:**
- `packages/server/src/tests/jestSetup.ts`: Sets jest timeout (100s dev, 30s CI), extends jest matchers, disables net connect
- `packages/server/src/tests/jestEnv.ts`: Sets environment variables for test execution

## Fixtures and Factories

**Test Data Builders:**

Location: `packages/server/src/tests/utilities/structures.ts`

**Basic Structure Builders:**
```typescript
export function basicTable(datasource?: Datasource, ...extra: Partial<Table>[]): Table {
  return tableForDatasource(
    datasource,
    {
      name: "TestTable",
      schema: {
        name: { type: FieldType.STRING, name: "name", ... },
        description: { type: FieldType.STRING, name: "description", ... },
      },
    },
    ...extra
  )
}

export function basicRow(...): Row { ... }
export function basicDatasource(...): Datasource { ... }
export function basicQuery(...): Query { ... }
export function basicAutomation(...): Automation { ... }
```

**Automation Test Builder:**

Location: `packages/server/src/automations/tests/utilities/AutomationTestBuilder.ts`

Builder pattern for fluent test creation:
```typescript
const automation = await createAutomationBuilder(config)
  .onRowUpdated({ tableId: table._id! })
  .serverLog({ text: "Row updated!" })
  .save()
  .then(({ automation }) => automation)
```

Classes: `TriggerBuilder`, `StepBuilder`, `BranchStepBuilder` for building automation steps fluently.

**TestConfiguration:**

Location: `packages/server/src/tests/utilities/TestConfiguration.ts`

Central test setup and API access:
```typescript
const config = new TestConfiguration()

beforeAll(async () => {
  await config.init("test-name")
})

afterAll(() => {
  config.end()
})

// API access
await config.api.table.save(basicTable())
await config.api.row.save(tableId, { name: "foo" })
await config.api.automation.deleteAll()
await config.withProdApp(async () => {
  // Test in production app context
})
```

## Test Types

**Unit Tests:**
- Test individual functions in isolation
- Mock external dependencies
- Located co-located with source: `middleware.ts` → `middleware.spec.ts`
- Example: `workspaceMigrations.spec.ts` tests middleware functions

**Integration Tests:**
- Test API endpoints and workflows
- Use `TestConfiguration` for full setup
- Test data flows through multiple layers
- Located in `tests/api/` or `tests/integrations/`
- Examples: `chatApps.spec.ts`, `chatConversations.spec.ts`

**Database Tests:**
- Use `datasourceDescribe()` function to test against multiple database types
- Environment variable: `DATASOURCE=<database_name>` to test specific DB
- Database names found in `packages/server/src/integrations/tests/utils/index.ts` as `DatabaseName` enum

**Automation Tests:**
- Use `createAutomationBuilder()` for fluent automation setup
- Capture results with `captureAutomationResults()`
- Test triggers and actions
- Example: `rowUpdated.spec.ts`

## Common Patterns

**Async Testing:**
```typescript
it("should queue a Bull job when row updated", async () => {
  const results = await captureAutomationResults(automation, async () => {
    await config.withProdApp(async () => {
      const row = await config.api.row.save(table._id!, { name: "foo" })
      await config.api.row.save(table._id!, { _id: row._id!, name: "bar" })
    })
  })

  expect(results).toHaveLength(1)
  expect(results[0].data.event).toEqual(
    expect.objectContaining({
      tableId: table._id!,
      row: expect.objectContaining({ name: "bar" }),
    })
  )
})
```

**Error Testing:**
```typescript
it("should throw other errors", async () => {
  const otherError = new Error("Some other error")
  mockGetConfig.mockRejectedValue(otherError)

  const middleware = activeTenant()
  await expect(middleware(ctx, next)).rejects.toThrow("Some other error")
  expect(next).not.toHaveBeenCalled()
})
```

**Response Testing:**
```typescript
it("rejects agents entries without agentId", async () => {
  const res = await updateChatApp({
    _id: chatApp._id,
    _rev: chatApp._rev,
    agents: [{}],
  })

  expect(res.status).toBe(400)
})
```

**State Assertion:**
Only assert final state, not intermediate states (per CLAUDE.md conventions):
```typescript
// Good: assert final state only
expect(results).toBeEmpty()

// Avoid: intermediate assertions (unless checking for type errors)
expect(results).toBeDefined()
expect(results).toHaveLength(0)  // Unnecessary given final assertion
```

## Coverage

**Requirements:** Not enforced — coverage collection configured but no minimum threshold

**Configuration** (jest.config.ts):
```typescript
collectCoverageFrom: [
  "src/**/*.{js,ts}",
  "!src/**/*.spec.{js,ts}",
  "!src/tests/**/*.{js,ts}",
  "!src/jsRunner/**/*.{js,ts}",  // JS runner breaks with coverage instrumentation
],
coverageReporters: ["lcov", "json", "clover"],
```

**Exclusions:**
- Test files: `**/*.spec.ts`
- Static views: `src/db/views/staticViews.*` (breaks CouchDB)
- JS runner: `src/jsRunner/**/*.ts` (coverage functions interfere with code execution)

**View Coverage:**
```bash
cd packages/server
yarn test --coverage
# Reports generated in coverage/ directory
```

## Test Timeout

**Configuration** (jestSetup.ts):
```typescript
if (!process.env.CI) {
  // Development: 100 seconds for debugging
  jest.setTimeout(100 * 1000)
} else {
  // CI: 30 seconds stricter timeout
  jest.setTimeout(30 * 1000)
}
```

## Environment Setup

**Test Environment Variables** (jestEnv.ts):
```typescript
process.env.SELF_HOSTED = "1"
process.env.NODE_ENV = "jest"
process.env.MULTI_TENANCY = "1"
process.env.MOCK_REDIS = "1"
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error"
process.env.DISABLE_PINO_LOGGER = "1"  // backend-core only
```

**Global Setup:**
- File: `globalSetup.ts` (referenced in all jest configs)
- Sets up test containers if needed
- Runs once per test session

---

*Testing analysis: 2026-03-21*
