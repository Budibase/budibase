<script>
  import {
    ModalContent,
    notifications,
    Input,
    InlineAlert,
  } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { API, dispatch, definition, rows } = getContext("grid")

  export let column

  let newColumnName = `${column.schema.name} (migrated)`

  const migrateUserColumn = async () => {
    let subtype = "users"
    if (column.schema.relationshipType === "one-to-many") {
      subtype = "user"
    }

    try {
      await API.migrateColumn({
        tableId: $definition._id,
        oldColumn: column.schema,
        newColumn: {
          name: newColumnName,
          type: "bb_reference",
          subtype,
        },
      })
      notifications.success("Column migrated")
    } catch (e) {
      notifications.error(`Failed to migrate: ${e.message}`)
    }
    await rows.actions.refreshData()
    dispatch("refreshdefintions")
  }
</script>

<ModalContent
  title="Migrate column"
  confirmText="Continue"
  cancelText="Cancel"
  onConfirm={migrateUserColumn}
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
  <Input bind:value={newColumnName} label="New column name" />
</ModalContent>
