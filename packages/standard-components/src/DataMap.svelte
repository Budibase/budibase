<script>
  import { GoogleMap } from "@beyonk/svelte-googlemaps"

  // export let _bb
  // export let onLoad
  // export let _instanceId
  // export let model

  // let mapComponent
  // let headers = []
  // let store = _bb.store

  // $: data = $store[model._id] || []

  // async function fetchData() {
  //   const FETCH_RECORDS_URL = `/api/${_instanceId}/all_${model._id}/records`
  //   const response = await _bb.api.get(FETCH_RECORDS_URL)
  //   if (response.status === 200) {
  //     const json = await response.json()

  //     store.update(state => {
  //       state[model._id] = json
  //       return state
  //     });
  //   } else {
  //     throw new Error("Failed to fetch records.", response)
  //   }
  // }
</script>

<GoogleMap apiKey={'AIzaSyCPJ_eiSIbhRMmKBiVYXgh4HFHmbC4ZL5U'} />
