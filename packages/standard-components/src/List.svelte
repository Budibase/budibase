<script>
  import { onMount } from "svelte"

  export let _bb
  export let model

  let headers = []
  let store = _bb.store
  let target

  async function fetchData() {
    if (!model || !model.length) return

    const FETCH_RECORDS_URL = `/api/views/all_${model}`
    const response = await _bb.api.get(FETCH_RECORDS_URL)
    if (response.status === 200) {
      const json = await response.json()

      _bb.attachChildren(target, {
        hydrate: false,
        context: json,
      })
    } else {
      throw new Error("Failed to fetch records.", response)
    }
  }

  $: if (model) fetchData()

  onMount(async () => {
    await fetchData()
  })
</script>

<section bind:this={target}>
</section>
