<script lang="ts">
  import { Switcher, AbsTooltip, TooltipPosition } from "@budibase/bbui"
  import { DataEnvironmentMode } from "@budibase/types"
  import { dataEnvironmentStore, tables, datasources } from "@/stores/builder"
  import { TableNames } from "@/constants"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"

  $: isDevMode = $dataEnvironmentStore.mode === DataEnvironmentMode.DEVELOPMENT
  $: tableId = $tables.selected?._id!
  $: isBudiUsersTable = tableId === TableNames.USERS
  $: isInternal = $tables.selected?.sourceType !== DB_TYPE_EXTERNAL
  $: tableDatasource = $datasources.list.find(datasource => {
    return datasource._id === $tables.selected?.sourceId
  })
  $: disabled = !isInternal && !tableDatasource?.usesEnvironmentVariables
  $: tooltip = "No production environment variables"
  $: hideSwitcher = isBudiUsersTable

  $: if (isBudiUsersTable) {
    dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)
  }

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

{#if !hideSwitcher}
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
