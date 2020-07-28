<script>
  import { params, goto } from "@sveltech/routify"
  import { Input, TextArea, Button } from "@budibase/bbui"
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

<div class="background">
  <p>
    Type DELETE into the textbox, then click the following button to delete your
    web app:
  </p>
  <Input
    on:change={e => (value = e.target.value)}
    on:input={e => (value = e.target.value)}
    thin
    disabled={loading}
    placeholder="" />

  <Button
    disabled={value !== 'DELETE' || loading}
    red
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
    padding: 12px 0px;
  }
  p {
    margin: 0;
  }
  .background :global(button) {
    max-width: 100%;
  }
</style>
