<script>
  import { onMount } from "svelte"
  import fetchData from "./fetchData.js"
  import { isEmpty } from "lodash/fp"

  export let _bb
  export let datasource = []

  let target

  onMount(async () => {
    if (!isEmpty(datasource)) {
      const data = await fetchData(datasource)
      _bb.attachChildren(target, {
        hydrate: false,
        context: data,
      })
    }
  })
</script>

<section bind:this={target} />
