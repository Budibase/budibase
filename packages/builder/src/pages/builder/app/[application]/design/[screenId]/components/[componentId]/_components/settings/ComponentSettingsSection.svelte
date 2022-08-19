<script>
  import { isEmpty } from "lodash/fp"
  import { Input, DetailSummary, notifications } from "@budibase/bbui"
  import { store } from "builderStore"
  import PropertyControl from "components/design/settings/controls/PropertyControl.svelte"
  import ResetFieldsButton from "components/design/settings/controls/ResetFieldsButton.svelte"
  import { getComponentForSetting } from "components/design/settings/componentSettings"

  export let componentDefinition
  export let componentInstance
  export let bindings
  export let componentBindings
  export let isScreen = false

  $: sections = getSections(componentDefinition)

  const getSections = definition => {
    const settings = definition?.settings ?? []
    const generalSettings = settings.filter(setting => !setting.section)
    const customSections = settings.filter(setting => setting.section)
    return [
      {
        name: "General",
        info: componentDefinition?.info,
        settings: generalSettings,
      },
      ...(customSections || []),
    ]
  }

  const updateSetting = async (key, value) => {
    try {
      await store.actions.components.updateSetting(key, value)
    } catch (error) {
      notifications.error("Error updating component prop")
    }
  }

  const canRenderControl = (setting, isScreen) => {
    // Prevent rendering on click setting for screens
    if (setting?.type === "event" && isScreen) {
      return false
    }

    const control = getComponentForSetting(setting)
    if (!control) {
      return false
    }

    // Parse dependant settings
    if (setting.dependsOn) {
      let dependantSetting = setting.dependsOn
      let dependantValue = null
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
        const currentValue = componentInstance[dependantSetting]
        if (currentValue === false) {
          return false
        }
        if (currentValue === true) {
          return true
        }
        return !isEmpty(currentValue)
      }

      // Otherwise check the value matches
      return componentInstance[dependantSetting] === dependantValue
    }

    return true
  }
</script>

{#each sections as section, idx (section.name)}
  <DetailSummary name={section.name} collapsible={false}>
    {#if idx === 0 && !componentInstance._component.endsWith("/layout") && !isScreen}
      <PropertyControl
        control={Input}
        label="Name"
        key="_instanceName"
        value={componentInstance._instanceName}
        onChange={val => updateSetting("_instanceName", val)}
      />
    {/if}
    {#each section.settings as setting (setting.key)}
      {#if canRenderControl(setting, isScreen)}
        <PropertyControl
          type={setting.type}
          control={getComponentForSetting(setting)}
          label={setting.label}
          key={setting.key}
          value={componentInstance[setting.key]}
          defaultValue={setting.defaultValue}
          nested={setting.nested}
          onChange={val => updateSetting(setting.key, val)}
          highlighted={$store.highlightedSettingKey === setting.key}
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
    {#if section?.info}
      <div class="text">
        {@html section.info}
      </div>
    {/if}
  </DetailSummary>
{/each}

<style>
  .text {
    font-size: var(--spectrum-global-dimension-font-size-75);
    color: var(--grey-6);
  }
</style>
