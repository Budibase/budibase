<script>
  import { params, goto } from "@sveltech/routify"
  import { Input, TextArea, Button, Body } from "@budibase/bbui"
  import { del } from "builderStore/api"

  let value = ""
  let loading = false

  async function deleteApp() {
    loading = true
    const id = $params.application
    await del(`/api/applications/${id}`)
    loading = false
    $goto("/")
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
    on:change={e => (value = e.target.value)}
    on:input={e => (value = e.target.value)}
    thin
    disabled={loading}
    placeholder="" />
  <div class="buttons">
    <Button
      primary
      disabled={value !== 'DELETE' || loading}
      red
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
