<script>
  import { onMount } from "svelte"
  import { isEmpty } from "lodash/fp"

  export let _bb
  export let model

  let record = {}

  $: {
    record.modelId = model
  }

  let target

  onMount(async () => {
    if (!isEmpty(record) && record.model) {
      _bb.attachChildren(target, {
        context: record,
      })
    }
  })
</script>

<section bind:this={target} />
