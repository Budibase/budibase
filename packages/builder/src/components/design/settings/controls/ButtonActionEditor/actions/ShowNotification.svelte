<script>
  import { Select, Label, Checkbox } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  import { _ } from "../../../../../../../lang/i18n"

  export let parameters
  export let bindings = []

  const types = [
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.ShowNotification.Success"
      ),
      value: "success",
    },
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.ShowNotification.Warning"
      ),
      value: "warning",
    },
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.ShowNotification.Error"
      ),
      value: "error",
    },
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.ShowNotification.Info"
      ),
      value: "info",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "success"
    }
    if (parameters.autoDismiss == null) {
      parameters.autoDismiss = true
    }
  })
</script>

<div class="root">
  <Label
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.ShowNotification.Type"
    )}</Label
  >
  <Select bind:value={parameters.type} options={types} placeholder={null} />
  <Label
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.ShowNotification.Message"
    )}</Label
  >
  <DrawerBindableInput
    {bindings}
    value={parameters.message}
    on:change={e => (parameters.message = e.detail)}
  />
  <Label />
  <Checkbox
    text={$_(
      "components.design.settings.controls.ButtonActionEditor.actions.ShowNotification.Auto_dismiss"
    )}
    bind:value={parameters.autoDismiss}
  />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
