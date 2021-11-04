<script>
  import { isEmpty } from "lodash/fp"
  import { Input, DetailSummary } from "@budibase/bbui"
  import { store } from "builderStore"
  import PropertyControl from "./PropertyControls/PropertyControl.svelte"
  import LayoutSelect from "./PropertyControls/LayoutSelect.svelte"
  import RoleSelect from "./PropertyControls/RoleSelect.svelte"
  import ResetFieldsButton from "./PropertyControls/ResetFieldsButton.svelte"
  import { getComponentForSettingType } from "./PropertyControls/componentSettings"

  export let componentDefinition
  export let componentInstance
  export let assetInstance
  export let bindings

  const layoutDefinition = []
  const screenDefinition = [
    { key: "description", label: "Description", control: Input },
    { key: "routing.route", label: "Route", control: Input },
    { key: "routing.roleId", label: "Access", control: RoleSelect },
    { key: "layoutId", label: "Layout", control: LayoutSelect },
  ]

  $: settings = componentDefinition?.settings ?? []
  $: generalSettings = settings.filter(setting => !setting.section)
  $: sections = settings.filter(setting => setting.section)
  $: isLayout = assetInstance && assetInstance.favicon
  $: assetDefinition = isLayout ? layoutDefinition : screenDefinition

  const updateProp = store.actions.components.updateProp

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
        return !isEmpty(componentInstance[dependantSetting])
      }

      // Otherwise check the value matches
      return componentInstance[dependantSetting] === dependantValue
    }

    return true
  }
</script>

<DetailSummary name="General" collapsible={false}>
  {#if !componentInstance._component.endsWith("/layout")}
    <PropertyControl
      bindable={false}
      control={Input}
      label="Name"
      key="_instanceName"
      value={componentInstance._instanceName}
      onChange={val => updateProp("_instanceName", val)}
    />
  {/if}
  {#if generalSettings.length}
    {#each generalSettings as setting (setting.key)}
      {#if canRenderControl(setting)}
        <PropertyControl
          type={setting.type}
          control={getComponentForSettingType(setting.type)}
          label={setting.label}
          key={setting.key}
          value={componentInstance[setting.key] ??
            componentInstance[setting.key]?.defaultValue}
          {componentInstance}
          onChange={val => updateProp(setting.key, val)}
          props={{
            options: setting.options || [],
            placeholder: setting.placeholder || null,
            min: setting.min || null,
            max: setting.max || null,
          }}
          {bindings}
          {componentDefinition}
        />
      {/if}
    {/each}
  {/if}
  {#if componentDefinition?.component?.endsWith("/fieldgroup")}
    <ResetFieldsButton {componentInstance} />
  {/if}
  {#if componentDefinition?.info}
    <div class="text">
      {@html componentDefinition.info}
    </div>
  {/if}
</DetailSummary>

{#each sections as section (section.name)}
  <DetailSummary name={section.name} collapsible={false}>
    {#each section.settings as setting (setting.key)}
      {#if canRenderControl(setting)}
        <PropertyControl
          type={setting.type}
          control={getComponentForSettingType(setting.type)}
          label={setting.label}
          key={setting.key}
          value={componentInstance[setting.key] ??
            componentInstance[setting.key]?.defaultValue}
          {componentInstance}
          onChange={val => updateProp(setting.key, val)}
          props={{
            options: setting.options || [],
            placeholder: setting.placeholder || null,
            min: setting.min || null,
            max: setting.max || null,
          }}
          {bindings}
          {componentDefinition}
        />
      {/if}
    {/each}
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
