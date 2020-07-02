<script>
  import { Input, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"
  import Title from "../TabTitle.svelte"

  let keys = { budibase: "", sendGrid: "" }

  async function updateKey([key, value]) {
    const response = await api.put(`/api/keys/${key}`, { value })
    const res = await response.json()
    keys = { ...keys, ...res }
  }

  // Get Keys
  async function fetchKeys() {
    const response = await api.get(`/api/keys/`)
    const res = await response.json()
    keys = res
  }

  fetchKeys()
</script>

<Title>API Keys</Title>
<div class="container">
  <div class="background">
    <Input
      on:save={e => updateKey(['budibase', e.detail])}
      thin
      edit
      value={keys.budibase}
      label="Budibase" />
  </div>
  <div class="background">
    <Input
      on:save={e => updateKey(['sendgrid', e.detail])}
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
