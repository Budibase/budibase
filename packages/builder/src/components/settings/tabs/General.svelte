<script>
  import { Input, TextArea, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"
  import Title from "../TabTitle.svelte"

  async function updateApplication(data) {
    const response = await api.put(`/api/${$store.appId}/appPackage`, data)
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

<Title>General</Title>
<div class="container">
  <div class="background">
    <Input
      on:save={e => updateApplication({ name: e.detail })}
      thin
      edit
      value={$store.name}
      label="Name" />
  </div>
  <div class="background">
    <TextArea
      on:save={e => updateApplication({ description: e.detail })}
      thin
      edit
      value={$store.description}
      label="Name" />
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
