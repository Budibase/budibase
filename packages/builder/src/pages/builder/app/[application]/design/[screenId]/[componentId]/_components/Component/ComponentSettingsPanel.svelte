<script>
  import Panel from "components/design/Panel.svelte"
  import {
    selectedScreen,
    componentStore,
    selectedComponent,
  } from "stores/frontend"
  import ComponentSettingsSection from "./ComponentSettingsSection.svelte"
  import DesignSection from "./DesignSection.svelte"
  import CustomStylesSection from "./CustomStylesSection.svelte"
  import ConditionalUISection from "./ConditionalUISection.svelte"

  import {
    getBindableProperties,
    getComponentBindableProperties,
  } from "builder/dataBinding"
  import { ActionButton } from "@budibase/bbui"
  import { capitalise } from "helpers"

  $: componentInstance = $selectedComponent
  $: componentDefinition = componentStore.getDefinition(
    $selectedComponent?._component
  )
  $: bindings = getBindableProperties(
    $selectedScreen,
    $componentStore.selectedComponentId
  )

  $: componentBindings = getComponentBindableProperties(
    $selectedScreen,
    $componentStore.selectedComponentId
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
        <ComponentSettingsSection
          {componentInstance}
          {componentDefinition}
          {bindings}
          {componentBindings}
          {isScreen}
        />
      {/if}
      {#if section == "styles"}
        <DesignSection {componentInstance} {componentDefinition} {bindings} />
        <CustomStylesSection
          {componentInstance}
          {componentDefinition}
          {bindings}
        />
      {/if}
      {#if section == "conditions"}
        <ConditionalUISection
          {componentInstance}
          {componentDefinition}
          {bindings}
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
