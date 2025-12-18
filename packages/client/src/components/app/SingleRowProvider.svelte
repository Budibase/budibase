<script lang="ts">
  import { getContext } from "svelte"
  import type { Row, TableDatasource, ViewDatasource } from "@budibase/types"

  export let datasource: TableDatasource | ViewDatasource
  export let rowId: string

  const component = getContext("component")
  const { styleable, API, Provider, ActionTypes } = getContext("sdk")

  let row: Row | null | undefined
  let loading = true

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
      loading = false
      return
    }

    loading = true
    try {
      row = await API.fetchRow(datasourceId, rowId)
    } catch (e) {
      row = undefined
    } finally {
      loading = false
    }
  }
</script>

{#if !loading}
  <div use:styleable={$component.styles}>
    <Provider {actions} data={row ?? null}>
      <slot />
    </Provider>
  </div>
{/if}

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
</style>
