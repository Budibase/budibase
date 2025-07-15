# Budibase Upgrade Tests

This package contains tests that verify Budibase upgrades work correctly. The tests are designed to run before and after an upgrade to ensure data integrity and functionality is preserved.

## Quick Start

```bash
# Install dependencies and build
yarn install
yarn build

# Run full upgrade test from a specific version
yarn test:upgrade full --from 3.12.0

# Or use the scripts directly
./scripts/upgrade-test.sh full --from 3.12.0

# List available versions to test
yarn list:versions

# Import an app into running Budibase
yarn import:app car-rental
```

## Writing Tests

### Basic Structure

Tests use Jest with custom helpers for upgrade scenarios:

```typescript
import { BudibaseClient, preUpgrade, postUpgrade, upgradeContext } from "@budibase/upgrade-tests"

describe("My Upgrade Test", () => {
  let client: BudibaseClient
  
  beforeAll(() => {
    client = new BudibaseClient()
  })
  
  preUpgrade(() => {
    it("should capture state before upgrade", async () => {
      const tables = await client.table.fetch()
      upgradeContext.set("tableCount", tables.length)
    })
  })
  
  postUpgrade(() => {
    it("should preserve state after upgrade", async () => {
      const oldCount = upgradeContext.get<number>("tableCount")
      const tables = await client.table.fetch()
      expect(tables.length).toBe(oldCount)
    })
  })
})
```

### App-Specific Tests

You can write tests that only run for specific apps:

```typescript
import { forApp, onlyForApp } from "@budibase/upgrade-tests"

// All tests in this block only run for the Car Rental app
forApp("car-rental", () => {
  preUpgrade(() => {
    it("should have car-specific tables", async () => {
      const tables = await client.table.fetch()
      const carTable = tables.find(t => t.name.includes("car"))
      expect(carTable).toBeDefined()
    })
  })
})

// Or use conditional tests
describe("General Tests", () => {
  preUpgrade(() => {
    // This test only runs when testing the Car Rental app
    onlyForApp("car-rental")("should have rental data", async () => {
      // Test specific to car rental app
    })
  })
})
```

## Version-Specific Tests

Skip tests based on version:

```typescript
import { skipIfOlderThan } from "@budibase/upgrade-tests"

// Only run this test when upgrading from 3.10.0 or newer
skipIfOlderThan("3.10.0")("should test new feature", async () => {
  // Test code
})
```

## Running Tests Locally

### Adding Test Apps

1. Export your app from Budibase as a `.tar.gz` file
2. Place it in `src/fixtures/`
3. Create app-specific tests using the `forApp()` helper
4. The app name should match the filename (without `.tar.gz`)

## Running Tests

The unified `upgrade-test.sh` script provides all upgrade testing functionality:

### Commands

```bash
# Run full upgrade test from a specific version
./scripts/upgrade-test.sh full --from 3.12.0

# Run only pre-upgrade tests
./scripts/upgrade-test.sh pre --from 3.12.0

# Run only post-upgrade tests  
./scripts/upgrade-test.sh post

# Import an app into running Budibase
./scripts/upgrade-test.sh import car-rental

# List available Budibase versions
./scripts/upgrade-test.sh list-versions

# Show help
./scripts/upgrade-test.sh help
```

### Options

- `--from <version>` - The Budibase version to upgrade from (required for full/pre)
- `--to <version>` - The version to upgrade to (default: current)
- `--app <path|name>` - Path to app export or fixture name to import
- `--test-app <name>` - Test only a specific app
- `--no-cleanup` - Don't clean up containers after test
- `--verbose` - Show detailed output

### Examples

```bash
# Test upgrade from 3.12.0 with a specific app
./scripts/upgrade-test.sh full --from 3.12.0 --app car-rental

# Run pre-upgrade tests only (useful for debugging)
./scripts/upgrade-test.sh pre --from 3.12.0 --verbose

# Import multiple apps then run tests
./scripts/upgrade-test.sh import basic-app
./scripts/upgrade-test.sh import car-rental
./scripts/upgrade-test.sh post

# Keep containers running for debugging
./scripts/upgrade-test.sh full --from 3.12.0 --no-cleanup
```

The full upgrade test will:
1. Start Budibase version specified with --from
2. Import specified apps (or all fixtures if none specified)
3. Run pre-upgrade tests
4. Stop old version and build/start current branch
5. Run post-upgrade tests
6. Clean up containers (unless --no-cleanup is used)

## GitHub Actions

The tests run automatically on pull requests. You can also trigger manually:

1. Go to Actions → Upgrade Tests
2. Click "Run workflow"
3. Optionally specify versions or apps to test

## Environment Variables

- `BUDIBASE_URL` - URL of Budibase instance (default: http://localhost:10000)
- `INTERNAL_API_KEY` - API key for authentication (default: budibase)
- `BB_ADMIN_USER_EMAIL` - Admin user email (default: admin@example.com)
- `BB_ADMIN_USER_PASSWORD` - Admin user password (default: admin123!)
- `TEST_PHASE` - Either "pre-upgrade" or "post-upgrade"
- `OLD_VERSION` - Version being upgraded from
- `TEST_APP` - Specific app to test (optional)
- `TEST_APP_ID` - Specific app ID to test
- `BUDIBASE_CONTAINER_NAME` - Container name (auto-generated if not set)

## API Reference

### BudibaseClient

The client provides namespaced APIs for different resources:

- `client.application` - App operations (fetch, get, import)
- `client.table` - Table operations (fetch, get)
- `client.row` - Row operations (fetch, search)
- `client.automation` - Automation operations (fetch, test)
- `client.query` - Query operations (fetch, execute)
- `client.view` - View operations (fetch)

### Test Helpers

- `preUpgrade(() => {})` - Tests that run before upgrade
- `postUpgrade(() => {})` - Tests that run after upgrade
- `forApp(appName, () => {})` - Tests that run for specific app
- `onlyForApp(appName)` - Conditional test for specific app
- `skipIfOlderThan(version)` - Skip test for old versions
- `upgradeContext` - Share data between pre/post upgrade tests