<script>
  import { DetailSummary, notifications } from "@budibase/bbui"
  import { componentStore, builderStore } from "@/stores/builder"
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"
  import ResetFieldsButton from "@/components/design/settings/controls/ResetFieldsButton.svelte"
  import EjectBlockButton from "@/components/design/settings/controls/EjectBlockButton.svelte"
  import { getComponentForSetting } from "@/components/design/settings/componentSettings"
  import InfoDisplay from "./InfoDisplay.svelte"
  import analytics, { Events } from "@/analytics"
  import { shouldDisplaySetting } from "@budibase/frontend-core"
  import { getContext, setContext } from "svelte"

  export let componentDefinition
  export let componentInstance
  export let bindings
  export let componentBindings
  export let isScreen = false
  export let onUpdateSetting
  export let showSectionTitle = true
  export let includeHidden = false
  export let tag

  // Sometimes we render component settings using a complicated nested
  // component instance technique. This results in instances with IDs that
  // don't exist anywhere in the tree. Therefore we need to keep track of
  // what the real component tree ID is so we can always find it.
  const rootId = getContext("rootId")
  if (!rootId) {
    setContext("rootId", componentInstance._id)
  }
  $: componentInstance._rootId = rootId || componentInstance._id

  $: sections = getSections(
    componentInstance,
    componentDefinition,
    isScreen,
    tag,
    includeHidden
  )

  const getSections = (instance, definition, isScreen, tag, includeHidden) => {
    const settings = definition?.settings ?? []
    const generalSettings = settings.filter(
      setting => !setting.section && setting.tag === tag
    )
    const customSections = settings.filter(
      setting => setting.section && setting.tag === tag
    )
    let sections = []
    if (generalSettings.length) {
      sections.push({
        name: "General",
        settings: generalSettings,
      })
    }
    if (customSections.length) {
      sections = sections.concat(customSections)
    }

    // Filter out settings which shouldn't be rendered
    sections.forEach(section => {
      section.visible = shouldDisplaySetting(instance, section)
      if (!section.visible) {
        return
      }
      section.settings.forEach(setting => {
        setting.visible = canRenderControl(
          instance,
          setting,
          isScreen,
          includeHidden
        )
      })
      section.visible =
        section.name === "General" ||
        section.settings.some(setting => setting.visible)
    })

    return sections
  }

  const updateSetting = async (setting, value) => {
    try {
      if (typeof onUpdateSetting === "function") {
        await onUpdateSetting(setting, value)
      } else {
        await componentStore.updateSetting(setting.key, value)
      }
      // Send event if required
      if (setting.sendEvents) {
        analytics.captureEvent(Events.COMPONENT_UPDATED, {
          name: componentInstance._component,
          setting: setting.key,
          value,
        })
      }
    } catch (error) {
      notifications.error("Error updating component prop")
    }
  }

  const canRenderControl = (instance, setting, isScreen, includeHidden) => {
    // Prevent rendering on click setting for screens
    if (setting?.type === "event" && isScreen) {
      return false
    }
    // Check we have a component to render for this setting
    const control = getComponentForSetting(setting)
    if (!control) {
      return false
    }
    // Check if setting is hidden
    if (setting.hidden && !includeHidden) {
      return false
    }
    return shouldDisplaySetting(instance, setting)
  }
</script>

{#each sections as section, idx (section.name)}
  {#if section.visible}
    <DetailSummary
      name={showSectionTitle ? section.name : ""}
      initiallyShow={section.collapsed !== true}
      collapsible={section.name !== "General"}
    >
      {#if section.info}
        <div class="section-info">
          <InfoDisplay body={section.info} />
        </div>
      {:else if idx === 0 && section.name === "General" && componentDefinition?.info && !tag}
        <InfoDisplay
          title={componentDefinition.name}
          body={componentDefinition.info}
        />
      {/if}
      <div class="settings">
        {#each section.settings as setting (setting.key)}
          {#if setting.visible}
            <PropertyControl
              type={setting.type}
              control={getComponentForSetting(setting)}
              label={setting.label}
              labelHidden={setting.labelHidden}
              wide={setting.wide}
              key={setting.key}
              value={componentInstance[setting.key]}
              defaultValue={setting.defaultValue}
              nested={setting.nested}
              onChange={val => updateSetting(setting, val)}
              propertyFocus={$builderStore.propertyFocus === setting.key}
              info={setting.info}
              disableBindings={setting.disableBindings}
              props={{
                // Generic settings
                placeholder: setting.placeholder || null,
                license: setting.license,

                // Select settings
                options: setting.options || [],

                // Number fields
                min: setting.min ?? null,
                max: setting.max ?? null,

                // Field select settings
                explanation: setting.explanation,
              }}
              {bindings}
              {componentBindings}
              {componentInstance}
              {componentDefinition}
              on:drawerShow
              on:drawerHide
            />
          {/if}
        {/each}
        {#if idx === 0 && componentDefinition?.component?.endsWith("/fieldgroup")}
          <ResetFieldsButton {componentInstance} />
        {/if}
      </div>
    </DetailSummary>
  {/if}
{/each}
{#if componentDefinition?.block && !tag && componentDefinition.ejectable !== false}
  <DetailSummary name="Eject" collapsible={false}>
    <EjectBlockButton />
  </DetailSummary>
{/if}

<style>
  .settings {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 8px;
  }
</style>
