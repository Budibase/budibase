<script>
  import {
    ModalContent,
    notifications,
    Input,
    InlineAlert,
  } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { ValidColumnNameRegex } from "@budibase/shared-core"

  const { API, definition, rows } = getContext("grid")

  export let column

  let newColumnName = `${column.schema.name} migrated`
  $: error = checkNewColumnName(newColumnName)

  const checkNewColumnName = newColumnName => {
    if (newColumnName === "") {
      return "Column name can't be empty."
    }
    if (newColumnName in $definition.schema) {
      return "New column name can't be the same as an existing column name."
    }
    if (newColumnName.match(ValidColumnNameRegex) === null) {
      return "Illegal character; must be alpha-numeric."
    }
  }

  const migrateUserColumn = async () => {
    try {
      await API.migrateColumn(
        $definition._id,
        column.schema.name,
        newColumnName
      )
      notifications.success("Column migrated")
    } catch (e) {
      notifications.error(`Failed to migrate: ${e.message}`)
    }
    await rows.actions.refreshData()
  }
</script>

<ModalContent
  title="Migrate column"
  confirmText="Continue"
  cancelText="Cancel"
  onConfirm={migrateUserColumn}
  disabled={error !== undefined}
  size="M"
>
  This operation will kick off a migration of the column "{column.schema.name}"
  to a new column, with the name provided - this operation may take a moment to
  complete.

  <InlineAlert
    type="error"
    header="Are you sure?"
    message="This will leave bindings which utilised the user relationship column in a state where they will need to be updated to use the new column instead."
  />
  <Input bind:value={newColumnName} label="New column name" {error} />
</ModalContent>
