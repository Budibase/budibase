<script lang="ts">
  import { getContext } from "svelte"
  import type { Row, TableDatasource, ViewDatasource } from "@budibase/types"

  export let datasource: TableDatasource | ViewDatasource
  export let rowId: string

  const component = getContext("component")
  const { styleable, API, Provider, ActionTypes } = getContext("sdk")

  let row: Row | undefined

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
    try {
      row = await API.fetchRow(datasourceId, rowId)
    } catch (e) {
      row = undefined
    }
  }
</script>

<div use:styleable={$component.styles}>
  <Provider {actions} data={row ?? null}>
    <slot />
  </Provider>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
</style>
