<script>
  import { get } from "svelte/store"
  import { isEqual } from "lodash"
  import { integrationForDatasource } from "@/stores/selectors"
  import { integrations, datasources } from "@/stores/builder"
  import { notifications, Button } from "@budibase/bbui"

  export let datasource
  export let updatedDatasource

  $: hasChanged = !isEqual(datasource, updatedDatasource)

  const save = async () => {
    try {
      const integration = integrationForDatasource(
        get(integrations),
        updatedDatasource
      )
      await datasources.save({ datasource: updatedDatasource, integration })
      notifications.success(
        `Datasource ${updatedDatasource.name} updated successfully`
      )
    } catch (error) {
      notifications.error(`Error saving datasource: ${error.message}`)
    }
  }
</script>

<Button disabled={!hasChanged} cta on:click={save}>Save</Button>
