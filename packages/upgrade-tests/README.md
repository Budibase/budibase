# Budibase Upgrade Tests

This package contains automated tests to ensure Budibase upgrades work correctly
between versions.

## Running Upgrade Tests

### Prerequisites

- Docker must be installed and running

### Basic Usage

Run a full upgrade test from a specific version:

```bash
yarn test:upgrade --from 3.13.0
```

Test with a specific app:

```bash
yarn test:upgrade full --from 3.13.0 --app car-rental
```

Test with a specific --to version:

```bash
yarn test:upgrade full --from 3.13.0 --to 3.14.0 --app car-rental
```

### Test Apps

Test apps are stored in `src/fixtures/` as `.tar.gz` files. These are real
Budibase app exports

## Writing Upgrade Tests

### Test Structure

Upgrade tests use a special test runner that supports pre-upgrade and post-upgrade phases:

```typescript
import { it } from "../utils/upgradeTest"

it("should preserve table data after upgrade", {
  pre: async context => {
    // This runs on the OLD version before upgrade
    const client = new BudibaseClient()

    // Create test data
    const table = await client.table.create({
      name: "test_table",
      schema: {
        name: { type: "string", name: "name" },
      },
    })

    const row = await client.row.create(table._id!, {
      name: "Test Row",
    })

    // Return data to be used in post-upgrade phase
    return { tableId: table._id, rowId: row._id }
  },

  post: async (context, data) => {
    // This runs on the NEW version after upgrade
    const client = new BudibaseClient()

    // Verify data still exists
    const row = await client.row.get(data.tableId, data.rowId)
    expect(row.name).toBe("Test Row")
  },
})
```
