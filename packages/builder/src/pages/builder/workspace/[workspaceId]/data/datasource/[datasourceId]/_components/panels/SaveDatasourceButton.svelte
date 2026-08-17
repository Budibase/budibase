<script>
  import { isEqual } from "lodash"
  import { integrations } from "@/stores/builder"
  import { notifications, Button } from "@budibase/bbui"

  export let datasource
  export let updatedDatasource
  export let onSaved
  export let isDirty

  $: hasChanged =
    typeof isDirty === "boolean"
      ? isDirty
      : !isEqual(datasource, updatedDatasource)

  const save = async () => {
    try {
      await integrations.saveDatasource(updatedDatasource)
      notifications.success(
        `Datasource ${updatedDatasource.name} updated successfully`
      )
      onSaved?.()
    } catch (error) {
      notifications.error(`Error saving datasource: ${error.message}`)
    }
  }
</script>

<Button disabled={!hasChanged} cta on:click={save}>Save</Button>
