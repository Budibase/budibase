<script lang="ts">
  import { Switcher, AbsTooltip, TooltipPosition } from "@budibase/bbui"
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
  // external tables are always considered deployed
  $: isDeployed =
    !isInternal || $workspaceDeploymentStore.tables[tableId]?.published
  $: tableDatasource = $datasources.list.find(datasource => {
    return datasource._id === $tables.selected?.sourceId
  })
  $: hidden = !isInternal && !tableDatasource?.usesEnvironmentVariables

  $: switcherProps = {
    leftIcon: "wrench",
    leftText: "Dev",
    rightIcon: "pulse",
    rightText: "Prod",
    selected: (isDevMode ? "left" : "right") as "left" | "right",
    disabled: !isDeployed,
  }

  const handleLeft = () =>
    dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)
  const handleRight = () =>
    dataEnvironmentStore.setMode(DataEnvironmentMode.PRODUCTION)
</script>

{#if !hidden}
  <div class="wrapper">
    {#if !isDeployed}
      <AbsTooltip
        text={"Please publish to view production"}
        position={TooltipPosition.Left}
      >
        <Switcher
          {...switcherProps}
          on:left={handleLeft}
          on:right={handleRight}
        />
      </AbsTooltip>
    {:else}
      <Switcher
        {...switcherProps}
        on:left={handleLeft}
        on:right={handleRight}
      />
    {/if}
  </div>
{/if}

<style>
  .wrapper {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
