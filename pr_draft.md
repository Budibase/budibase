Title: fix(builder): prevent type reset and flicker in User Action automation

## Description
When adding bindings to the User Action automation flow, changing a variable type to anything other than Text and then adding another variable caused all existing variables to reset to Text. Deleting variables was also inconsistent and often required a refresh to reflect changes.

This PR simplifies `SchemaSetup.svelte` to a minimal, robust approach:

- Use a single local `fields` array derived from `value`
- Unkeyed `each` loop to avoid node teardown/recreation flicker
- Never mutate props; always dispatch a full mapping object

Result: variable types persist when adding/removing fields, name-input no longer flickers on blur, and deletions are immediate and predictable.

## Addresses
- N/A (no ticket provided)

## App Export
N/A

## Screenshots
N/A (builder behavior change only)

## Launchcontrol
Fixes a bug where variable types in the User Action automation setup reset to Text when adding a new variable, and deletions were unreliable. Now types persist and deletions reflect instantly without refresh.
