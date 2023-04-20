<script>
  import { Label } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { _ } from "../../../../../../../lang/i18n"

  export let parameters
  export let bindings = []
</script>

<div class="root">
  <span>
    {$_(
      "components.design.settings.controls.ButtonActionEditor.actions.CloseScreenModal.can_navigate"
    )}
  </span>
  <Label small
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.CloseScreenModal.Screen"
    )}</Label
  >
  <DrawerBindableInput
    title={$_(
      "components.design.settings.controls.ButtonActionEditor.actions.CloseScreenModal.Destination_URL"
    )}
    placeholder="/screen"
    value={parameters.url}
    on:change={value => (parameters.url = value.detail)}
    {bindings}
  />
</div>

<style>
  span {
    grid-column: 1 / 3;
  }
  .root {
    display: grid;
    align-items: center;
    gap: var(--spacing-m);
    grid-template-columns: auto 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
