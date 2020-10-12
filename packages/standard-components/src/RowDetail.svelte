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
      return { modelId: model }
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
      if (model) record = await fetchFirstRecord()
    } else if (_bb.routeParams().id) {
      const GET_RECORD_URL = `/api/${model}/records/${_bb.routeParams().id}`
      const response = await _bb.api.get(GET_RECORD_URL)
      if (response.status === 200) {
        record = await response.json()
      } else {
        throw new Error("Failed to fetch record.", response)
      }
    } else {
      throw new Exception("Record ID was not supplied to RowDetail")
    }

    if (record) {
      // Fetch model schema so we can check for linked records
      const modelObj = await fetchModel(record.modelId)
      for (let key of Object.keys(modelObj.schema)) {
        if (modelObj.schema[key].type === "link") {
          record[key] = Array.isArray(record[key]) ? record[key].length : 0
        }
      }

      record._model = modelObj

      _bb.attachChildren(target, {
        context: record,
      })
    } else {
      _bb.attachChildren(target)
    }
  }

  onMount(async () => {
    await fetchData()
  })
</script>

<section bind:this={target} />
