<script>
  import { Input, Label } from "@budibase/bbui"
  import api from "builderStore/api"
  import { backendUiStore } from "builderStore"
  import analytics from "analytics"

  let keys = { budibase: "" }

  async function updateKey([key, value]) {
    if (key === "budibase") {
      const isValid = await analytics.identifyByApiKey(value)
      if (!isValid) {
        // TODO: add validation message
        keys = { ...keys }
        return
      }
    }
    const response = await api.put(`/api/keys/${key}`, { value })
    const res = await response.json()
    keys = { ...keys, ...res }
  }

  // Get Keys
  async function fetchKeys() {
    const response = await api.get(`/api/keys/`)
    const res = await response.json()
    // dont want this to ever be editable, as its fetched based on Api Key
    if (res.userId) delete res.userId
    keys = res
  }

  fetchKeys()
</script>

<div class="container">
  <Input
    on:save={e => updateKey(['budibase', e.detail])}
    thin
    edit
    value={keys.budibase}
    label="Budibase API Key" />
  <div>
    <Label extraSmall grey>Instance ID (Webhooks)</Label>
    <span>{$backendUiStore.selectedDatabase._id}</span>
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  span {
    font-size: var(--font-size-xs);
    font-weight: 500;
  }
</style>
