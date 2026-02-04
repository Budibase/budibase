<script lang="ts">
  import { getContext } from "svelte"
  import type { Row, TableDatasource, ViewDatasource } from "@budibase/types"

  export let datasource: TableDatasource | ViewDatasource
  export let rowId: string
  export let noRowMessage: string | undefined

  const component = getContext("component")
  const { styleable, API, Provider, ActionTypes } = getContext("sdk")

  let row: Row | null | undefined
  let loading = true
  let noRowFound = false

  $: datasourceId =
    datasource.type === "table" ? datasource.tableId : datasource.id
  $: fetchRow(datasourceId, rowId)
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => fetchRow(datasourceId, rowId),
      metadata: { dataSource: datasource },
    },
  ]

  const fetchRow = async (datasourceId: string, rowId: string) => {
    if (!datasourceId || !rowId) {
      row = undefined
      noRowFound = true
      loading = false
      return
    }

    loading = true
    noRowFound = false
    try {
      row = await API.fetchRow(datasourceId, rowId, true)
      noRowFound = row == null
    } catch (e) {
      row = undefined
      noRowFound = true
    } finally {
      loading = false
    }
  }
</script>

{#if !loading}
  <div use:styleable={$component.styles}>
    {#if noRowFound}
      <div class="noRows">
        <i class="ri-list-check-2"></i>{noRowMessage ?? "No row found"}
      </div>
    {:else}
      <Provider {actions} data={row ?? null}>
        <slot />
      </Provider>
    {/if}
  </div>
{/if}

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  .noRows {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
    padding: var(--spacing-l);
    display: grid;
    place-items: center;
  }
  .noRows i {
    margin-bottom: var(--spacing-m);
    font-size: 1.5rem;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
