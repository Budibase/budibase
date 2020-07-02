<script>
  import { Input, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"
  import Title from "../TabTitle.svelte"

  let keys = { budibase: "", sendGrid: "" }

  async function updateKey(e) {
    console.log("Event Key: ", e.detail)
    // Send to endpoint when it exists
    const response = await api.put(`/api/${$store.appId}`, data)
    // const res = await response.json()
  }

  // Get Keys
  async function fetchKeys() {
    const response = await api.get(`/api/keys/`)
    const res = await response.json()
    console.log("Res: ", res)
    // fetch keys from endpoint
    // return keys
  }

  let fetchKeysPromise = fetchKeys()
</script>

<Title>API Keys</Title>
<div class="container">
  <div class="background">
    <Input
      on:save={updateKey}
      thin
      edit
      value={keys.budibase}
      label="Budibase" />
  </div>
  <div class="background">
    <Input
      on:save={updateKey}
      thin
      edit
      value={keys.sendgrid}
      label="Sendgrid" />
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-gap: var(--space);
  }
  .background {
    border-radius: 5px;
    background-color: var(--light-grey);
    padding: 12px 12px 18px 12px;
  }
</style>
