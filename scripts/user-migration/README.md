# Budibase User Migration Script

A Node.js script for migrating users with their permissions between Budibase instances using the Public API.

## Features

- ✅ Export users from any Budibase instance (localhost, self-hosted, cloud)
- ✅ Preserve user permissions: workspace admin, creator/builder, app roles
- ✅ Automatic app and role mapping between instances using app/role names
- ✅ Dry-run mode to preview changes before applying
- ✅ Generate temporary passwords for migrated users
- ✅ Detailed import/export reports
- ✅ Handles existing users gracefully (skips duplicates)

## Prerequisites

- Node.js 14+ installed
- API keys for both source and target Budibase instances
- Network access to both instances

## Quick Start

### 1. Install Dependencies

```bash
cd scripts/user-migration
npm install
```

### 2. Get API Keys

Generate API keys from each Budibase instance:
1. Log in to Budibase
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the key (you'll need it in the next step)

### 3. Export Users from Source Instance

```bash
# Using command line arguments
node migrate-users.js export \
  --source http://localhost:10000 \
  --api-key your-source-api-key \
  --output users-export.json

# Or using environment variables
export SOURCE_URL=http://localhost:10000
export SOURCE_API_KEY=your-source-api-key
node migrate-users.js export
```

This creates `users-export.json` containing all users with their permissions.

### 4. Preview Import (Dry Run)

Before importing, preview what will happen:

```bash
node migrate-users.js import \
  --target http://localhost:10001 \
  --api-key your-target-api-key \
  --input users-export.json \
  --dry-run
```

### 5. Import Users to Target Instance

Once you're happy with the preview:

```bash
node migrate-users.js import \
  --target http://localhost:10001 \
  --api-key your-target-api-key \
  --input users-export.json
```

This will:
- Create all users in the target instance
- Assign their permissions (workspace admin, builder, app roles)
- Generate temporary passwords
- Save passwords to `users-export-passwords.json`

## Configuration

### Option 1: Environment Variables (Recommended)

Create a `.env` file in the `scripts/user-migration` directory:

```bash
# Source instance
SOURCE_URL=http://localhost:10000
SOURCE_API_KEY=your-source-api-key

# Target instance
TARGET_URL=http://localhost:10001
TARGET_API_KEY=your-target-api-key
```

Then run commands without arguments:

```bash
node migrate-users.js export
node migrate-users.js import --dry-run
node migrate-users.js import
```

### Option 2: Command Line Arguments

Pass configuration directly via CLI:

```bash
node migrate-users.js export \
  --source http://localhost:10000 \
  --api-key your-api-key \
  --output users.json

node migrate-users.js import \
  --target http://localhost:10001 \
  --api-key your-api-key \
  --input users.json
```

## Command Reference

### Export Command

Export users from a source instance.

**Options:**
- `-s, --source <url>` - Source instance URL (e.g., http://localhost:10000)
- `-k, --api-key <key>` - Source instance API key
- `-o, --output <path>` - Output file path (default: users-export.json)

**Example:**
```bash
node migrate-users.js export --source http://localhost:10000 --api-key abc123 --output my-users.json
```

**Output:**
- Creates JSON file with user data, app mappings, and role mappings
- Includes human-readable role names for easy review

### Import Command

Import users to a target instance.

**Options:**
- `-t, --target <url>` - Target instance URL (e.g., http://localhost:10001)
- `-k, --api-key <key>` - Target instance API key
- `-i, --input <path>` - Input file path (default: users-export.json)
- `-d, --dry-run` - Preview changes without applying them

**Example:**
```bash
node migrate-users.js import --target http://localhost:10001 --api-key xyz789 --input my-users.json --dry-run
```

**Output:**
- Creates users with mapped permissions
- Generates temporary passwords
- Saves passwords to `<input-file>-passwords.json`
- Provides detailed summary of successes/failures

## Use Cases

### Localhost to Localhost

Test migration between two local instances:

```bash
# Terminal 1: Run first instance on port 10000
cd budibase && yarn dev

# Terminal 2: Run second instance on port 10001
cd budibase && PORT=10001 yarn dev

# Terminal 3: Run migration
cd scripts/user-migration
node migrate-users.js export --source http://localhost:10000 --api-key key1
node migrate-users.js import --target http://localhost:10001 --api-key key2
```

### Cloud to Self-Hosted

Migrate from Budibase Cloud to your own infrastructure:

```bash
# Export from cloud
node migrate-users.js export \
  --source https://budibase.app \
  --api-key cloud-api-key

# Import to self-hosted
node migrate-users.js import \
  --target https://budibase.yourcompany.com \
  --api-key selfhosted-api-key
```

### Self-Hosted to Self-Hosted

Migrate between two self-hosted instances:

```bash
node migrate-users.js export --source https://old.company.com --api-key old-key
node migrate-users.js import --target https://new.company.com --api-key new-key
```

## How It Works

### Export Process

1. Connects to source instance via Public API
2. Fetches all users with their permissions
3. Fetches all applications and their roles
4. Creates mappings: App ID → App Name, Role ID → Role Name
5. Exports to JSON with both IDs and human-readable names

### Import Process

1. Loads export JSON file
2. Fetches target instance apps and roles
3. Creates reverse mappings: App Name → Target App ID, Role Name → Target Role ID
4. For each user:
   - Checks if user already exists (skips if yes)
   - Maps roles from source to target using app/role names
   - Generates temporary password
   - Creates user via Public API
5. Saves temporary passwords to file

### Role Mapping

The script maps roles between instances using **app names** and **role names**:

**Source Instance:**
- App "CRM" (ID: app_abc123) → Role "Manager" (ID: role_xyz789)

**Target Instance:**
- App "CRM" (ID: app_def456) → Role "Manager" (ID: role_uvw012)

The script automatically maps `app_abc123/role_xyz789` → `app_def456/role_uvw012` using the names "CRM" and "Manager".

## Permissions Migrated

The script migrates the following user permissions:

- **Workspace Admin** (`admin.global = true`)
- **Creator/Builder** (`builder.global = true` or `builder.creator = true`)
- **App-specific Roles** (mapped from source to target apps)
- **User Status** (active/inactive)

**Not migrated:**
- Passwords (temporary passwords generated)
- User groups (planned for future release)
- SSO configurations
- User sessions

## Troubleshooting

### "API request failed: 401 Unauthorized"

- Check that your API key is correct
- Ensure the API key has sufficient permissions
- Verify the instance URL is correct

### "App not found in target instance"

This warning appears when a user has a role in an app that doesn't exist in the target instance. The app role will be skipped for that user.

**Solution:** Create the missing app in the target instance before importing.

### "Role not found in app"

This warning appears when a role name from the source doesn't exist in the target app.

**Solution:** Ensure the target app has the same roles as the source app.

### Users already exist

The script automatically skips users that already exist in the target instance. Check the summary report for details.

## Security Notes

- 🔒 API keys are sensitive - never commit them to version control
- 🔒 Store the generated passwords file securely
- 🔒 Delete or encrypt password files after distributing to users
- 🔒 Use environment variables or `.env` files for credentials
- 🔒 Users should change their temporary passwords immediately after first login

## Limitations

- Maximum 1000 users per export (API limitation)
- User passwords are not migrated (new temporary passwords generated)
- User groups are not currently supported
- SSO configurations are not migrated
- Apps must exist in target instance with matching names
- Roles must exist in target apps with matching names

## Support

For issues or questions:
1. Check this README
2. Review the export JSON to understand data structure
3. Use `--dry-run` to preview changes
4. Check Budibase logs for API errors
5. Report issues at https://github.com/Budibase/budibase/issues

## License

GPL-3.0
