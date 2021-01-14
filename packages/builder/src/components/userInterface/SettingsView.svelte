<script>
  import { get } from "lodash"
  import { isEmpty } from "lodash/fp"
  import PropertyControl from "./PropertyPanelControls/PropertyControl.svelte"

  import Input from "./PropertyPanelControls/Input.svelte"

  import LayoutSelect from "./PropertyPanelControls/LayoutSelect.svelte"
  import RoleSelect from "./PropertyPanelControls/RoleSelect.svelte"
  import OptionSelect from "./PropertyPanelControls/OptionSelect.svelte"
  import MultiTableViewFieldSelect from "./MultiTableViewFieldSelect.svelte"
  import Checkbox from "../common/Checkbox.svelte"
  import TableSelect from "components/userInterface/PropertyPanelControls/TableSelect.svelte"
  import TableViewSelect from "components/userInterface/PropertyPanelControls/TableViewSelect.svelte"
  import TableViewFieldSelect from "components/userInterface/PropertyPanelControls/TableViewFieldSelect.svelte"
  import EventsEditor from "components/userInterface/PropertyPanelControls/EventsEditor"
  import ScreenSelect from "components/userInterface/PropertyPanelControls/ScreenSelect.svelte"
  import DetailScreenSelect from "components/userInterface/DetailScreenSelect.svelte"
  import IconSelect from "components/userInterface/PropertyPanelControls/IconSelect"
  import Colorpicker from "@budibase/colorpicker"

  export let componentDefinition = {}
  export let componentInstance = {}
  export let assetInstance
  export let onChange = () => {}
  export let onScreenPropChange = () => {}
  export let showDisplayName = false

  const assetProps = [
    "title",
    "description",
    "routing.route",
    "layoutId",
    "routing.roleId",
  ]

  $: settings = componentDefinition?.settings ?? []

  const controlMap = {
    text: Input,
    select: OptionSelect,
    datasource: TableViewSelect,
    detailURL: DetailScreenSelect,
    boolean: Checkbox,
    number: Input,
  }
  const getControl = type => {
    return controlMap[type]
  }

  const propExistsOnComponentDef = prop =>
    assetProps.includes(prop) || prop in (componentDefinition?.props ?? {})

  const layoutDefinition = []
  const screenDefinition = [
    { key: "description", label: "Description", control: Input },
    { key: "routing.route", label: "Route", control: Input },
    { key: "routing.roleId", label: "Access", control: RoleSelect },
    { key: "layoutId", label: "Layout", control: LayoutSelect },
  ]

  const canRenderControl = setting => {
    const control = getControl(setting?.type)
    if (!control) {
      return false
    }
    if (setting.dependsOn && isEmpty(componentInstance[setting.dependsOn])) {
      return false
    }
    return true
  }

  $: isLayout = assetInstance && assetInstance.favicon
  $: assetDefinition = isLayout ? layoutDefinition : screenDefinition

  const onInstanceNameChange = (_, name) => {
    onChange("_instanceName", name)
  }
</script>

<div class="settings-view-container">
  {#if assetInstance}
    {#each assetDefinition as def}
      <PropertyControl
        bindable={false}
        control={def.control}
        label={def.label}
        key={def.key}
        value={get(assetInstance, def.key)}
        onChange={onScreenPropChange} />
    {/each}
  {/if}

  {#if showDisplayName}
    <PropertyControl
      control={Input}
      label="Name"
      key="_instanceName"
      value={componentInstance._instanceName}
      onChange={onInstanceNameChange} />
  {/if}

  {#if settings && settings.length > 0}
    {#each settings as setting}
      {#if canRenderControl(setting)}
        <PropertyControl
          control={getControl(setting.type)}
          label={setting.label}
          key={setting.key}
          value={componentInstance[setting.key] ?? componentInstance[setting.key]?.defaultValue}
          {componentInstance}
          {onChange}
          props={{ options: setting.options }} />
      {/if}
    {/each}
  {:else}
    <div class="empty">
      This component doesn't have any additional settings.
    </div>
  {/if}
</div>

<style>
  .settings-view-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: var(--spacing-s);
  }
  .empty {
    font-size: var(--font-size-xs);
    margin-top: var(--spacing-m);
    color: var(--grey-5);
  }
</style>
