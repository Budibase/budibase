<script>
  import {
    DetailSummary,
    ActionButton,
    Drawer,
    Button,
    notifications,
  } from "@budibase/bbui"
  import { selectedScreen, store } from "builderStore"
  import ClientBindingPanel from "components/common/bindings/ClientBindingPanel.svelte"
  import {
    getBindableProperties,
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import { KeyboardShortcut } from "@budibase/frontend-core"

  export let componentInstance

  let tempValue
  let drawer

  $: bindings = getBindableProperties(
    $selectedScreen,
    $store.selectedComponentId
  )

  const openDrawer = () => {
    tempValue = runtimeToReadableBinding(
      bindings,
      componentInstance?._styles?.custom
    )
    drawer.show()
  }

  const save = async () => {
    try {
      const value = readableToRuntimeBinding(bindings, tempValue)
      await store.actions.components.updateCustomStyle(value)
    } catch (error) {
      notifications.error("Error updating custom style")
    }
    drawer.hide()
  }
</script>

<DetailSummary
  name={`Custom CSS${componentInstance?._styles?.custom ? " *" : ""}`}
  collapsible={false}
>
  <div>
    <ActionButton on:click={openDrawer}>Edit custom CSS</ActionButton>
  </div>
</DetailSummary>
{#key componentInstance?._id}
  <Drawer bind:this={drawer} title="Custom CSS">
    <svelte:fragment slot="description">
      Custom CSS overrides all other component styles.
    </svelte:fragment>
    <Button cta slot="buttons" on:click={save}>
      <div class="button-with-keys">
        Save
        <KeyboardShortcut action={true} keybind="Ctrl+Enter" />
      </div>
    </Button>
    <svelte:component
      this={ClientBindingPanel}
      slot="body"
      value={tempValue}
      on:change={event => (tempValue = event.detail)}
      on:saveCodeEditor={save}
      allowJS
      {bindings}
    />
  </Drawer>
{/key}

<style>
  .button-with-keys {
    display: flex;
    gap: 6px;
    align-items: center;
  }
</style>
