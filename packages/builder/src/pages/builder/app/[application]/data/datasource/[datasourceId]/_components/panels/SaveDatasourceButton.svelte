<script>
import { Button, notifications } from "@budibase/bbui"
import { isEqual } from "lodash"
import { datasources, integrations } from "stores/builder"
import { integrationForDatasource } from "stores/selectors"
import { get } from "svelte/store"

export let datasource
export let updatedDatasource

$: hasChanged = !isEqual(datasource, updatedDatasource)

const save = async () => {
  try {
    const integration = integrationForDatasource(
      get(integrations),
      updatedDatasource
    )
    await datasources.update({ datasource: updatedDatasource, integration })
    notifications.success(
      `Datasource ${updatedDatasource.name} updated successfully`
    )
  } catch (error) {
    notifications.error(`Error saving datasource: ${error.message}`)
  }
}
</script>

<Button disabled={!hasChanged} cta on:click={save}>Save</Button>
