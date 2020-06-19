<script>
  import { Input, TextArea, Button } from "@budibase/bbui"
  let value = ""
  let loading = false

  const deleteApp = () => {
    loading = true
    // Do stuff here to delete app!
    // Navigate to start
  }
</script>

<div class="background">
  <Input
    on:change={e => (value = e.target.value)}
    on:input={e => (value = e.target.value)}
    thin
    disabled={loading}
    placeholder="Enter your name"
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
