<script>
  import RestAuthenticationBuilder from "./RestAuthenticationBuilder.svelte"
  import { cloneDeep } from "lodash/fp"
  import Panel from "../Panel.svelte"
  import { integrations } from "@/stores/builder"
  import { notifications } from "@budibase/bbui"

  export let datasource
  export let updatedDatasource
  $: localUpdatedDatasource = cloneDeep(datasource ?? updatedDatasource)

  const updateAuthConfigs = async newAuthConfigs => {
    localUpdatedDatasource.config.authConfigs = newAuthConfigs

    // Auto-save authentication changes
    try {
      await integrations.saveDatasource(localUpdatedDatasource)
      notifications.success(
        `Datasource ${localUpdatedDatasource.name} updated successfully`
      )
    } catch (error) {
      notifications.error(`Error saving datasource: ${error.message}`)
    }
  }
</script>

<Panel>
  <RestAuthenticationBuilder
    on:change={({ detail }) => updateAuthConfigs(detail)}
    authConfigs={localUpdatedDatasource.config.authConfigs}
  />
</Panel>
