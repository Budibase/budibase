<script>
  import { _ } from "../../../../../../../lang/i18n"
  import { Label, Body, Layout } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []
</script>

<div class="root">
  <Layout noPadding gap="M">
    <Body size="S">
      {$_(
        "components.design.settings.controls.ButtonActionEditor.actions.LogOut.enter_URL"
      )}
    </Body>
    <div class="content">
      <Label small
        >{$_(
          "components.design.settings.controls.ButtonActionEditor.actions.LogOut.Redirect_URL"
        )}</Label
      >
      <DrawerBindableInput
        title={$_(
          "components.design.settings.controls.ButtonActionEditor.actions.LogOut.Return_URL"
        )}
        value={parameters.redirectUrl}
        on:change={value => (parameters.redirectUrl = value.detail)}
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
