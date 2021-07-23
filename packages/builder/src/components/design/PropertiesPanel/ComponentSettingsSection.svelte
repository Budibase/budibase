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

  const layoutDefinition = []
  const screenDefinition = [
    { key: "description", label: "Description", control: Input },
    { key: "routing.route", label: "Route", control: Input },
    { key: "routing.roleId", label: "Access", control: RoleSelect },
    { key: "layoutId", label: "Layout", control: LayoutSelect },
  ]

  $: settings = componentDefinition?.settings ?? []
  $: isLayout = assetInstance && assetInstance.favicon
  $: assetDefinition = isLayout ? layoutDefinition : screenDefinition

  const updateProp = store.actions.components.updateProp

  const canRenderControl = setting => {
    const control = getComponentForSettingType(setting?.type)
    if (!control) {
      return false
    }
    if (setting.dependsOn && isEmpty(componentInstance[setting.dependsOn])) {
      return false
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
  {#if settings && settings.length > 0}
    {#each settings as setting}
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
            options: setting.options,
            placeholder: setting.placeholder,
          }}
        />
      {/if}
    {/each}
  {/if}
  {#if componentDefinition?.component?.endsWith("/fieldgroup")}
    <ResetFieldsButton {componentInstance} />
  {/if}
  {#if componentDefinition?.info}
    <div class="text">
      {@html componentDefinition?.info}
    </div>
  {/if}
</DetailSummary>

<style>
  .text {
    font-size: var(--spectrum-global-dimension-font-size-75);
    color: var(--grey-6);
  }
</style>
