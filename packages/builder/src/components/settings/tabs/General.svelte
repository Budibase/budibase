<script>
  import { Input, TextArea, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"

  async function updateApplication(data) {
    const response = await api.put(`/api/${$store.appId}`, data)
    const app = await response.json()
    store.update(state => {
      state = {
        ...state,
        ...data,
      }
      return state
    })
  }
</script>

<div class="container">
  <Input
    on:save={e => updateApplication({ name: e.detail })}
    thin
    edit
    value={$store.name}
    label="App Name" />
  <TextArea
    on:save={e => updateApplication({ description: e.detail })}
    thin
    edit
    value={$store.description}
    label="App Description" />
</div>

<style>
  .container {
    display: grid;
    grid-gap: var(--spacing-xl);
  }
</style>
