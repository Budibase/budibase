<script>
  import { onMount } from "svelte"

  export let _bb
  export let model

  let headers = []
  let store = _bb.store
  let target

  async function fetchModel(id) {
    const FETCH_MODEL_URL = `/api/models/${id}`
    const response = await _bb.api.get(FETCH_MODEL_URL)
    return await response.json()
  }

  async function fetchFirstRecord() {
    const FETCH_RECORDS_URL = `/api/views/all_${model}`
    const response = await _bb.api.get(FETCH_RECORDS_URL)
    if (response.status === 200) {
      const allRecords = await response.json()
      if (allRecords.length > 0) return allRecords[0]
    }
  }

  async function fetchData() {
    const pathParts = window.location.pathname.split("/")

    if (!model) {
      return
    }

    let record
    // if srcdoc, then we assume this is the builder preview
    if (pathParts.length === 0 || pathParts[0] === "srcdoc") {
      record = await fetchFirstRecord()
    } else {
      const id = pathParts[pathParts.length - 1]
      const GET_RECORD_URL = `/api/${model}/records/${id}`
      const response = await _bb.api.get(GET_RECORD_URL)
      if (response.status === 200) {
        record = await response.json()
      }
    }

    if (record) {
      // Fetch model schema so we can check for linked records
      const model = await fetchModel(record.modelId)
      for (let key of Object.keys(model.schema)) {
        if (model.schema[key].type === "link") {
          record[key] = Array.isArray(record[key]) ? record[key].length : 0
        }
      }

      _bb.attachChildren(target, {
        hydrate: false,
        context: record,
      })
    } else {
      throw new Error("Failed to fetch record.", response)
    }
  }

  onMount(async () => {
    await fetchData()
  })
</script>

<section bind:this={target} />
