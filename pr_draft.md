Title: fix(builder): prevent type reset and flaky deletion in User Action automation

## Description
When adding bindings to the User Action automation flow, changing a variable type to anything other than Text and then adding another variable caused all existing variables to reset to Text. Deleting variables was also inconsistent and often required a refresh to reflect changes.

This PR updates `SchemaSetup.svelte` to:

- Preserve stable row IDs so Svelte doesn’t recreate rows and reset selects
- Treat `value` as source of truth and avoid mutating props directly
- Maintain local placeholders for unnamed fields (including selected type) until they’re committed
- Dispatch full mapping updates for rename/type changes and handle deletions deterministically

Result: variable types persist when adding/removing fields; deletions are immediate and predictable.

## Addresses
- N/A (no ticket provided)

## App Export
N/A

## Screenshots
N/A (builder behavior change only)

## Launchcontrol
Fixes a bug where variable types in the User Action automation setup reset to Text when adding a new variable, and deletions were unreliable. Now types persist and deletions reflect instantly without refresh.

