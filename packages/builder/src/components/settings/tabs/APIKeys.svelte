<script>
  import { Input, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"
  import posthog from "posthog-js"

  let keys = { budibase: "", sendGrid: "" }

  async function updateKey([key, value]) {
    const response = await api.put(`/api/keys/${key}`, { value })
    const res = await response.json()
    if (key === "budibase") posthog.identify(value)
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

<div class="container">
  <Input
    on:save={e => updateKey(['budibase', e.detail])}
    thin
    edit
    value={keys.budibase}
    label="Budibase API Key" />
  <Input
    on:save={e => updateKey(['sendgrid', e.detail])}
    thin
    edit
    value={keys.sendgrid}
    label="Sendgrid API Key" />
</div>

<style>
  .container {
    display: grid;
    grid-gap: var(--spacing-xl);
  }
</style>
