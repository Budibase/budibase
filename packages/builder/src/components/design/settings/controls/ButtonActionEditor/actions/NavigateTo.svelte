<script>
  import { _ } from "../../../../../../../lang/i18n"
  import { store } from "builderStore"
  import { onMount } from "svelte"
  import { Label, Checkbox, Select } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import DrawerBindableCombobox from "components/common/bindings/DrawerBindableCombobox.svelte"

  export let parameters
  export let bindings = []

  $: urlOptions = $store.screens
    .map(screen => screen.routing?.route)
    .filter(x => x != null)

  const typeOptions = [
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.NavigateTO.Screen"
      ),
      value: "screen",
    },
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.NavigateTO.URL"
      ),
      value: "url",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "screen"
    }
  })
</script>

<div class="root">
  <Label small
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.NavigateTO.Destination"
    )}</Label
  >
  <Select
    placeholder={null}
    bind:value={parameters.type}
    options={typeOptions}
    on:change={() => (parameters.url = "")}
  />
  {#if parameters.type === "screen"}
    <DrawerBindableCombobox
      title={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.NavigateTO.Destination"
      )}
      placeholder="/screen"
      value={parameters.url}
      on:change={value => (parameters.url = value.detail)}
      {bindings}
      options={urlOptions}
      appendBindingsAsOptions={false}
    />
    <div />
    <Checkbox
      text={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.NavigateTO.Destination"
      )}
      bind:value={parameters.peek}
    />
  {:else}
    <DrawerBindableInput
      title={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.NavigateTO.Destination"
      )}
      placeholder="/url"
      value={parameters.url}
      on:change={value => (parameters.url = value.detail)}
      {bindings}
    />
    <div />
    <Checkbox
      text={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.NavigateTO.New_Tab"
      )}
      bind:value={parameters.externalNewTab}
    />
  {/if}
</div>

<style>
  .root {
    display: grid;
    align-items: center;
    gap: var(--spacing-m);
    grid-template-columns: auto;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
