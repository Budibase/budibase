<script>
  import { isEmpty } from "lodash/fp"
  import { Input, DetailSummary, notifications } from "@budibase/bbui"
  import { store } from "builderStore"
  import PropertyControl from "components/design/settings/controls/PropertyControl.svelte"
  import ResetFieldsButton from "components/design/settings/controls/ResetFieldsButton.svelte"
  import EjectBlockButton from "components/design/settings/controls/EjectBlockButton.svelte"
  import { getComponentForSetting } from "components/design/settings/componentSettings"
  import analytics, { Events } from "analytics"

  export let componentDefinition
  export let componentInstance
  export let bindings
  export let componentBindings
  export let isScreen = false

  $: sections = getSections(componentInstance, componentDefinition, isScreen)

  const getSections = (instance, definition, isScreen) => {
    const settings = definition?.settings ?? []
    const generalSettings = settings.filter(setting => !setting.section)
    const customSections = settings.filter(setting => setting.section)
    let sections = [
      {
        name: "General",
        settings: generalSettings,
      },
      ...(customSections || []),
    ]

    // Filter out settings which shouldn't be rendered
    sections.forEach(section => {
      section.visible = shouldDisplay(instance, section)
      if (!section.visible) {
        return
      }
      section.settings.forEach(setting => {
        setting.visible = canRenderControl(instance, setting, isScreen)
      })
      section.visible =
        section.name === "General" ||
        section.settings.some(setting => setting.visible)
    })

    return sections
  }

  const updateSetting = async (setting, value) => {
    try {
      await store.actions.components.updateSetting(setting.key, value)

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

  const shouldDisplay = (instance, setting) => {
    // Parse dependant settings
    if (setting.dependsOn) {
      let dependantSetting = setting.dependsOn
      let dependantValue = null
      let invert = !!setting.dependsOn.invert
      if (typeof setting.dependsOn === "object") {
        dependantSetting = setting.dependsOn.setting
        dependantValue = setting.dependsOn.value
      }
      if (!dependantSetting) {
        return false
      }

      // If no specific value is depended upon, check if a value exists at all
      // for the dependent setting
      if (dependantValue == null) {
        const currentValue = instance[dependantSetting]
        if (currentValue === false) {
          return false
        }
        if (currentValue === true) {
          return true
        }
        return !isEmpty(currentValue)
      }

      // Otherwise check the value matches
      if (invert) {
        return instance[dependantSetting] !== dependantValue
      } else {
        return instance[dependantSetting] === dependantValue
      }
    }

    return true
  }

  const canRenderControl = (instance, setting, isScreen) => {
    // Prevent rendering on click setting for screens
    if (setting?.type === "event" && isScreen) {
      return false
    }
    const control = getComponentForSetting(setting)
    if (!control) {
      return false
    }

    return shouldDisplay(instance, setting)
  }
</script>

{#each sections as section, idx (section.name)}
  {#if section.visible}
    <DetailSummary name={section.name} collapsible={false}>
      {#if idx === 0 && !componentInstance._component.endsWith("/layout") && !isScreen}
        <PropertyControl
          control={Input}
          label="Name"
          key="_instanceName"
          value={componentInstance._instanceName}
          onChange={val => updateSetting({ key: "_instanceName" }, val)}
        />
      {/if}
      {#each section.settings as setting (setting.key)}
        {#if setting.visible}
          <PropertyControl
            type={setting.type}
            control={getComponentForSetting(setting)}
            label={setting.label}
            key={setting.key}
            value={componentInstance[setting.key]}
            defaultValue={setting.defaultValue}
            nested={setting.nested}
            onChange={val => updateSetting(setting, val)}
            highlighted={$store.highlightedSettingKey === setting.key}
            info={setting.info}
            props={{
              // Generic settings
              placeholder: setting.placeholder || null,

              // Select settings
              options: setting.options || [],

              // Number fields
              min: setting.min || null,
              max: setting.max || null,
            }}
            {bindings}
            {componentBindings}
            {componentInstance}
            {componentDefinition}
          />
        {/if}
      {/each}
      {#if idx === 0 && componentDefinition?.component?.endsWith("/fieldgroup")}
        <ResetFieldsButton {componentInstance} />
      {/if}
    </DetailSummary>
  {/if}
{/each}
{#if componentDefinition?.block}
  <DetailSummary name="Eject" collapsible={false}>
    <EjectBlockButton />
  </DetailSummary>
{/if}
