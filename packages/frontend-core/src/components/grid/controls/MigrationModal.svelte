<script>
  import { ModalContent, notifications } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { API, dispatch, definition, rows } = getContext("grid")

  export let column

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
          name: `${column.schema.name} migrated`,
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
  TODO: copy here
</ModalContent>
