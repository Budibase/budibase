<script lang="ts">
  import { Switcher, AbsTooltip, TooltipPosition } from "@budibase/bbui"
  import {
    dataEnvironmentStore,
    workspaceDeploymentStore,
    tables,
  } from "@/stores/builder"
  import { DataEnvironmentMode } from "@budibase/types"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"

  $: isDevMode = $dataEnvironmentStore.mode === DataEnvironmentMode.DEVELOPMENT
  $: tableId = $tables.selected?._id!
  $: isInternal = $tables.selected?.sourceType !== DB_TYPE_EXTERNAL
  $: isDeployed =
    isInternal && $workspaceDeploymentStore.tables[tableId]?.published
  $: hasProductionData = isInternal ? isDeployed : false
  $: switcherDisabled = !isInternal
  $: tooltip = isInternal
    ? "Publish to view production data"
    : "Production data is only available for internal tables"

  $: switcherProps = {
    leftIcon: "wrench",
    leftText: "Dev",
    rightIcon: "pulse",
    rightText: "Prod",
    selected: (isDevMode ? "left" : "right") as "left" | "right",
    disabled: switcherDisabled,
  }

  $: if (switcherDisabled && !isDevMode) {
    dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)
  }

  const handleLeft = () =>
    dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)
  const handleRight = () => {
    if (switcherDisabled) return
    dataEnvironmentStore.setMode(DataEnvironmentMode.PRODUCTION)
  }
</script>

<div class="wrapper">
  {#if !hasProductionData}
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
