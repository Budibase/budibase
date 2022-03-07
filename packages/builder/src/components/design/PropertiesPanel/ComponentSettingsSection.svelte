<script>
  import { isEmpty } from "lodash/fp"
  import { Input, DetailSummary, notifications } from "@budibase/bbui"
  import { store } from "builderStore"
  import PropertyControl from "./PropertyControls/PropertyControl.svelte"
  import LayoutSelect from "./PropertyControls/LayoutSelect.svelte"
  import RoleSelect from "./PropertyControls/RoleSelect.svelte"
  import ResetFieldsButton from "./PropertyControls/ResetFieldsButton.svelte"
  import { getComponentForSettingType } from "./PropertyControls/componentSettings"
  import { Utils } from "@budibase/frontend-core"

  export let componentDefinition
  export let componentInstance
  export let assetInstance
  export let bindings
  export let componentBindings

  const layoutDefinition = []
  const screenDefinition = [
    { key: "description", label: "Description", control: Input },
    { key: "routing.route", label: "Route", control: Input },
    { key: "routing.roleId", label: "Access", control: RoleSelect },
    { key: "layoutId", label: "Layout", control: LayoutSelect },
  ]

  $: sections = getSections(componentDefinition)
  $: isLayout = assetInstance && assetInstance.favicon
  $: assetDefinition = isLayout ? layoutDefinition : screenDefinition

  const getSections = definition => {
    const settings = definition?.settings ?? []
    const generalSettings = settings.filter(setting => !setting.section)
    const customSections = settings.filter(setting => setting.section)
    return [
      {
        name: componentDefinition?.name || "General",
        info: componentDefinition?.info,
        settings: generalSettings,
      },
      ...(customSections || []),
    ]
  }

  const updateProp = Utils.sequential(async (key, value) => {
    try {
      await store.actions.components.updateProp(key, value)
    } catch (error) {
      notifications.error("Error updating component prop")
    }
  })

  const canRenderControl = setting => {
    const control = getComponentForSettingType(setting?.type)
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
    {#if idx === 0 && !componentInstance._component.endsWith("/layout")}
      <PropertyControl
        control={Input}
        label="Name"
        key="_instanceName"
        value={componentInstance._instanceName}
        onChange={val => updateProp("_instanceName", val)}
      />
    {/if}
    {#each section.settings as setting (setting.key)}
      {#if canRenderControl(setting)}
        <PropertyControl
          type={setting.type}
          control={getComponentForSettingType(setting.type)}
          label={setting.label}
          key={setting.key}
          value={componentInstance[setting.key] ??
            componentInstance[setting.key]?.defaultValue}
          nested={setting.nested}
          onChange={val => updateProp(setting.key, val)}
          props={{
            options: setting.options || [],
            placeholder: setting.placeholder || null,
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
