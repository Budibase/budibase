<script>
  import { Input, Label, TextButton } from "@budibase/bbui"
  import api from "builderStore/api"
  import { notifier } from "builderStore/store/notifications"
  import { database } from 'stores/backend/'
  import analytics from "analytics"

  let keys = { budibase: "" }

  async function updateKey([key, value]) {
    if (key === "budibase") {
      const isValid = await analytics.identifyByApiKey(value)
      if (!isValid) {
        notifier.danger("Your API Key is invalid.")
        keys = { ...keys }
        return
      }
    }
    const response = await api.put(`/api/keys/${key}`, { value })
    const res = await response.json()
    keys = { ...keys, ...res }
    notifier.success("API Key saved.")
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
    label="Budibase Cloud API Key" />
  <TextButton text medium blue href="https://portal.budi.live">
    Log in to the Budibase Hosting Portal to get your API Key. →
  </TextButton>
  <div>
    <Label extraSmall grey>Instance ID (Webhooks)</Label>
    <span>{$database._id}</span>
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
