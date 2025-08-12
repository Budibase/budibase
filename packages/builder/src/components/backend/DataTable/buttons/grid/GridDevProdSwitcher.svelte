<script lang="ts">
  import { Switcher, Icon, TooltipPosition } from "@budibase/bbui"
  import {
    dataEnvironmentStore,
    workspaceDeploymentStore,
    tables,
    datasources,
  } from "@/stores/builder"
  import { DataEnvironmentMode } from "@budibase/types"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"

  $: isDevMode = $dataEnvironmentStore.mode === DataEnvironmentMode.DEVELOPMENT
  $: tableId = $tables.selected?._id!
  $: isInternal = $tables.selected?.sourceType !== DB_TYPE_EXTERNAL
  $: isDeployed =
    isInternal && $workspaceDeploymentStore.tables[tableId]?.published
  $: tableDatasource = $datasources.list.find(datasource => {
    return datasource._id === $tables.selected?.sourceId
  })
  $: disabled = !isDeployed && !tableDatasource?.usesEnvironmentVariables
</script>

<div class="wrapper">
  <Switcher
    leftIcon="wrench"
    leftText="Dev"
    rightIcon="rocket"
    rightText="Prod"
    selected={isDevMode ? "left" : "right"}
    {disabled}
    on:left={() =>
      dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)}
    on:right={() =>
      dataEnvironmentStore.setMode(DataEnvironmentMode.PRODUCTION)}
  />
  {#if disabled}
    <Icon
      name="info"
      tooltipPosition={TooltipPosition.Left}
      tooltip={isInternal && !isDeployed
        ? "Please publish to view production"
        : "No production environment variables"}
    />
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
