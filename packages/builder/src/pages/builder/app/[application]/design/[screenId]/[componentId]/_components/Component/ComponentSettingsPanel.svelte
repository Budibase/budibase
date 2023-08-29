<script>
  import Panel from "components/design/Panel.svelte"
  import {
    store,
    selectedComponent,
    selectedScreen,
    themeStore,
  } from "builderStore"
  import ComponentSettingsSection from "./ComponentSettingsSection.svelte"
  import DesignSection from "./DesignSection.svelte"
  import CustomStylesSection from "./CustomStylesSection.svelte"
  import ConditionalUISection from "./ConditionalUISection.svelte"
  import ComponentInfoSection from "./ComponentInfoSection.svelte"
  import {
    getBindableProperties,
    getComponentBindableProperties,
  } from "builderStore/dataBinding"
  import { ActionButton } from "@budibase/bbui"
  import { capitalise } from "helpers"

  $: componentInstance = $selectedComponent
  $: componentDefinition = store.actions.components.getDefinition(
    $selectedComponent?._component
  )
  $: bindings = getBindableProperties(
    $selectedScreen,
    $store.selectedComponentId
  )

  // frontend Constant Themes
  $: globalBindings = [
    ...bindings,
    {
      type: "context",
      runtimeBinding: `[device].[theme]`, //app.settings?
      readableBinding: `App.Theme`,
      category: "Settings",
      icon: "Settings",
      display: { type: "string", name: "Theme" },
    },
  ]
  $: console.log(globalBindings)

  $: componentBindings = getComponentBindableProperties(
    $selectedScreen,
    $store.selectedComponentId
  )
  $: isScreen = $selectedComponent?._id === $selectedScreen?.props._id
  $: title = isScreen ? "Screen" : $selectedComponent?._instanceName

  let section = "settings"
  const tabs = ["settings", "styles", "conditions"]

  $: id = $selectedComponent?._id
  $: id, (section = tabs[0])
</script>

{#if $selectedComponent}
  {#key $selectedComponent._id}
    <Panel {title} icon={componentDefinition?.icon} borderLeft wide>
      <span slot="panel-header-content">
        <div class="settings-tabs">
          {#each tabs as tab}
            <ActionButton
              size="M"
              quiet
              selected={section === tab}
              on:click={() => {
                section = tab
              }}
            >
              {capitalise(tab)}
            </ActionButton>
          {/each}
        </div>
      </span>
      {#if section == "settings"}
        {#if componentDefinition?.info}
          <ComponentInfoSection {componentDefinition} />
        {/if}
        <ComponentSettingsSection
          {componentInstance}
          {componentDefinition}
          bindings={globalBindings}
          {componentBindings}
          {isScreen}
        />
      {/if}
      {#if section == "styles"}
        <DesignSection
          {componentInstance}
          {componentDefinition}
          bindings={globalBindings}
        />
        <CustomStylesSection
          {componentInstance}
          {componentDefinition}
          bindings={globalBindings}
        />
      {/if}
      {#if section == "conditions"}
        <ConditionalUISection
          {componentInstance}
          {componentDefinition}
          bindings={globalBindings}
        />
      {/if}
    </Panel>
  {/key}
{/if}

<style>
  .settings-tabs {
    display: flex;
    gap: var(--spacing-s);
    padding: 0 var(--spacing-l);
    padding-bottom: var(--spacing-l);
  }
</style>
