<script>
  import { params, goto } from "@sveltech/routify"
  import { Input, TextArea, Button } from "@budibase/bbui"
  import Title from "../TabTitle.svelte"
  import { del } from "builderStore/api"

  let value = ""
  let loading = false

  async function deleteApp() {
    loading = true
    const id = $params.application
    const res = await del(`/api/${id}`)
    const json = await res.json()

    loading = false
    if (res.ok) {
      $goto("/")
      return json
    } else {
      throw new Error(json)
    }
  }
</script>

<Title>Danger Zone</Title>
<div class="background">
  <Input
    on:change={e => (value = e.target.value)}
    on:input={e => (value = e.target.value)}
    thin
    disabled={loading}
    placeholder=""
    label="Type DELETE into the textbox, then click the following button to
    delete your web app:" />

  <Button
    disabled={value !== 'DELETE' || loading}
    primary
    wide
    on:click={deleteApp}>
    Delete Entire Web App
  </Button>
</div>

<style>
  .background {
    display: grid;
    grid-gap: 16px;
    border-radius: 5px;
    background-color: var(--light-grey);
    padding: 12px 12px 18px 12px;
  }
  .background :global(button) {
    max-width: 100%;
  }
</style>
