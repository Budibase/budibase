<script>
  import { params, goto } from "@roxi/routify"
  import { Input, Button, Body } from "@budibase/bbui"
  import { del } from "builderStore/api"

  let value = ""
  let loading = false

  async function deleteApp() {
    loading = true
    const id = $params.application
    await del(`/api/applications/${id}`)
    loading = false
    $goto("/builder/")
  }
</script>

<div class="background">
  <Body>
    Type
    <b>DELETE</b>
    into the textbox, then click the following button to delete your entire web
    app.
  </Body>
  <Input
    on:change={e => (value = e.detail)}
    disabled={loading}
    placeholder="" />
  <div class="buttons">
    <Button
      warning
      disabled={value !== 'DELETE' || loading}
      on:click={deleteApp}>
      Delete Entire App
    </Button>
  </div>
</div>

<style>
  .background {
    display: grid;
    grid-gap: var(--spacing-xl);
  }
  .background :global(p) {
    line-height: 1.2;
    margin: 0;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
