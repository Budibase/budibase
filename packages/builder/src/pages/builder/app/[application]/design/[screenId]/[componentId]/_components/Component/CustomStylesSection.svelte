<script>
  import {
    DetailSummary,
    ActionButton,
    Drawer,
    Button,
    notifications,
    AbsTooltip,
    Icon,
    Body,
  } from "@budibase/bbui"
  import { selectedScreen, componentStore } from "@/stores/builder"
  import ClientBindingPanel from "@/components/common/bindings/ClientBindingPanel.svelte"
  import {
    getBindableProperties,
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "@/dataBinding"
  import { builderStore } from "@/stores/builder"
  import ButtonTheme from "@/components/design/settings/controls/ButtonTheme.svelte"
  export let componentInstance
  export let componentDefinition
  export let iconTooltip
  export let componentTitle

  let tempValue
  let drawer

  $: bindings = getBindableProperties(
    $selectedScreen,
    $componentStore.selectedComponentId
  )

  $: icon = componentDefinition?.icon

  $: highlighted = $builderStore.highlightedSetting?.key === "_styles"

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
      await componentStore.updateCustomStyle(value)
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
  <div class:highlighted>
    <ActionButton on:click={openDrawer}>Edit custom CSS</ActionButton>
  </div>
</DetailSummary>

{#if componentInstance?._component === "@budibase/standard-components/button"}
  <DetailSummary name="Button theme" collapsible={false}>
    <ButtonTheme />
  </DetailSummary>
{/if}
{#key componentInstance?._id}
  <Drawer bind:this={drawer} title="Custom CSS">
    <svelte:fragment slot="description">
      <div class="header">
        Your CSS will overwrite styles for:
        {#if icon}
          <AbsTooltip type="info" text={iconTooltip}>
            <Icon
              color={`var(--spectrum-global-color-gray-600)`}
              size="S"
              name={icon}
            />
          </AbsTooltip>
          <Body size="S"><b>{componentTitle || ""}</b></Body>
        {/if}
      </div>
    </svelte:fragment>
    <Button cta slot="buttons" on:click={save}>Save</Button>
    <svelte:component
      this={ClientBindingPanel}
      slot="body"
      value={tempValue}
      on:change={event => (tempValue = event.detail)}
      allowJS
      {bindings}
      autofocusEditor={true}
    />
  </Drawer>
{/key}

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }

  .highlighted {
    background: var(--spectrum-global-color-gray-300);
    border-left: 4px solid var(--spectrum-semantic-informative-color-background);
    transition: background 130ms ease-out, border-color 130ms ease-out;
    margin: -4px calc(-1 * var(--spacing-xl));
    padding: 4px var(--spacing-xl) 4px calc(var(--spacing-xl) - 4px);
  }
</style>
