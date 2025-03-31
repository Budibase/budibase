<script lang="ts">
  import { getContext } from "svelte"
  import type { Row } from "@budibase/types"

  export let datasourceId: string
  export let rowId: string

  const component = getContext("component")
  const { styleable, API, Provider } = getContext("sdk")

  let row: Row | undefined

  $: fetchRow(datasourceId, rowId)

  const fetchRow = async (datasourceId: string, rowId: string) => {
    try {
      row = await API.fetchRow(datasourceId, rowId)
    } catch (e) {
      row = undefined
    }
  }
</script>

<div use:styleable={$component.styles}>
  <Provider data={row}>
    <slot />
  </Provider>
</div>
