<script>
  import { onMount } from "svelte"
  import fetchData from "./fetchData.js"
  import { isEmpty } from "lodash/fp"

  export let _bb
  export let datasource = []

  let target
  let store = _bb.store

  onMount(async () => {
    if (!isEmpty(datasource)) {
      const data = await fetchData(datasource, $store)
      _bb.attachChildren(target, {
        hydrate: false,
        context: data,
      })
    }
  })
</script>

<section bind:this={target} />
