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
  $: isDeployed =
    isInternal && $workspaceDeploymentStore.tables[tableId]?.published
  $: tableDatasource = $datasources.list.find(datasource => {
    return datasource._id === $tables.selected?.sourceId
  })
  $: disabled = !isDeployed && !tableDatasource?.usesEnvironmentVariables
  $: tooltip =
    isInternal && !isDeployed
      ? "Please publish to view production"
      : "No production environment variables"

  $: switcherProps = {
    leftIcon: "wrench",
    leftText: "Dev",
    rightIcon: "pulse",
    rightText: "Prod",
    selected: (disabled && !isInternal
      ? "right"
      : isDevMode
        ? "left"
        : "right") as "left" | "right",
    disabled,
  }

  const handleLeft = () =>
    dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)
  const handleRight = () =>
    dataEnvironmentStore.setMode(DataEnvironmentMode.PRODUCTION)
</script>

<div class="wrapper">
  {#if disabled}
    <AbsTooltip text={tooltip} position={TooltipPosition.Left}>
      <Switcher
        {...switcherProps}
        on:left={handleLeft}
        on:right={handleRight}
      />
    </AbsTooltip>
  {:else}
    <Switcher {...switcherProps} on:left={handleLeft} on:right={handleRight} />
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
