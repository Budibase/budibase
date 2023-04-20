<script>
  import { _ } from "../../../../../../../../../../../lang/i18n"
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
      notifications.error(
        $_(
          "pages.builder.app.application.design.screenId.components.componentId._components.settings.CustomStyleSection.Error_updating"
        )
      )
    }
    drawer.hide()
  }
</script>

<DetailSummary
  name={`${$_(
    "pages.builder.app.application.design.screenId.components.componentId._components.settings.CustomStyleSection.Custom_CSS"
  )}${componentInstance?._styles?.custom ? " *" : ""}`}
  collapsible={false}
>
  <div>
    <ActionButton on:click={openDrawer}
      >{$_(
        "pages.builder.app.application.design.screenId.components.componentId._components.settings.CustomStyleSection.Edit_custom"
      )}</ActionButton
    >
  </div>
</DetailSummary>
{#key componentInstance?._id}
  <Drawer bind:this={drawer} title="Custom CSS">
    <svelte:fragment slot="description">
      {$_(
        "pages.builder.app.application.design.screenId.components.componentId._components.settings.CustomStyleSection.Custom"
      )}
    </svelte:fragment>
    <Button cta slot="buttons" on:click={save}
      >{$_(
        "pages.builder.app.application.design.screenId.components.componentId._components.settings.CustomStyleSection.Save"
      )}</Button
    >
    <svelte:component
      this={ClientBindingPanel}
      slot="body"
      value={tempValue}
      on:change={event => (tempValue = event.detail)}
      allowJS
      {bindings}
    />
  </Drawer>
{/key}
