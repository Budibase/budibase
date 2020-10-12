<script>
  import { onMount } from "svelte"

  export let _bb
  export let model

  let record = {}

  $: {
    record.modelId = model
  }

  let target

  async function fetchModel(id) {
    const FETCH_MODEL_URL = `/api/models/${id}`
    const response = await _bb.api.get(FETCH_MODEL_URL)
    return await response.json()
  }

  onMount(async () => {
    if (model) {
      const modelObj = await fetchModel(model)
      record.modelId = model
      record._model = modelObj
      _bb.attachChildren(target, {
        context: record,
      })
    } else {
      _bb.attachChildren(target, {
        context: {},
      })
    }
  })
</script>

<section bind:this={target} />
