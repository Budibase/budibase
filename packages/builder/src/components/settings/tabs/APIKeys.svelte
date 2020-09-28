<script>
  import { Input, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"
  import posthog from "posthog-js"
  import analytics from "../../../analytics"

  let keys = { budibase: "", sendGrid: "" }

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
    padding: 12px 0px;
  }
</style>
