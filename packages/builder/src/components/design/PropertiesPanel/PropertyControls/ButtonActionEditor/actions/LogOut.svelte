<script>
  import { Label, Body, Layout } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []
</script>

<div class="root">
  <Layout noPadding gap="M">
    <Body size="S">
      Please enter what URL you would like to be redirected to after logging
      out. If you dont' enter a value, you'll be redirected to the login screen.
    </Body>
    <div class="content">
      <Label small>Return URL</Label>
      <DrawerBindableInput
        title="Return URL"
        value={parameters.returnUrl}
        on:change={value => (parameters.returnUrl = value.detail)}
        {bindings}
      />
    </div>
  </Layout>
</div>

<style>
  .root {
    max-width: 400px;
    margin: 0 auto;
  }
  .content {
    display: grid;
    align-items: center;
    gap: var(--spacing-m);
    grid-template-columns: auto 1fr;
  }
</style>
