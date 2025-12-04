<script lang="ts">
  import { Switcher, AbsTooltip, TooltipPosition } from "@budibase/bbui"
  import { DataEnvironmentMode } from "@budibase/types"
  import {
    dataEnvironmentStore,
    workspaceDeploymentStore,
    tables,
  } from "@/stores/builder"
  import { TableNames } from "@/constants"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"

  $: isDevMode = $dataEnvironmentStore.mode === DataEnvironmentMode.DEVELOPMENT
  $: tableId = $tables.selected?._id!
  $: isBudiUsersTable = tableId === TableNames.USERS
  $: isInternal = $tables.selected?.sourceType !== DB_TYPE_EXTERNAL
  $: isDeployed =
    isInternal && $workspaceDeploymentStore.tables[tableId]?.published
  $: hasProductionData = isInternal ? isDeployed : true
  $: switcherDisabled = !isInternal
  $: tooltip = isInternal
    ? "Publish to view production data"
    : "Dev data is only available for internal tables"
  $: showTooltip = switcherDisabled || !hasProductionData
  $: hideSwitcher = isBudiUsersTable

  $: switcherProps = {
    leftIcon: "wrench",
    leftText: "Dev",
    rightIcon: "pulse",
    rightText: "Prod",
    selected: (isDevMode ? "left" : "right") as "left" | "right",
    disabled: switcherDisabled,
  }

  $: if (isBudiUsersTable) {
    dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)
  }

  $: if (switcherDisabled && isDevMode && !isBudiUsersTable) {
    dataEnvironmentStore.setMode(DataEnvironmentMode.PRODUCTION)
  }

  const handleLeft = () =>
    dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)
  const handleRight = () => {
    if (switcherDisabled) return
    dataEnvironmentStore.setMode(DataEnvironmentMode.PRODUCTION)
  }
</script>

{#if !hideSwitcher}
  <div class="wrapper">
    {#if showTooltip}
      <AbsTooltip text={tooltip} position={TooltipPosition.Left}>
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
