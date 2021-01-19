<script>
  import { get } from "lodash"
  import { isEmpty } from "lodash/fp"

  import PropertyControl from "./PropertyControls/PropertyControl.svelte"
  import Input from "./PropertyControls/Input.svelte"
  import LayoutSelect from "./PropertyControls/LayoutSelect.svelte"
  import RoleSelect from "./PropertyControls/RoleSelect.svelte"
  import OptionSelect from "./PropertyControls/OptionSelect.svelte"
  import MultiTableViewFieldSelect from "./PropertyControls/MultiTableViewFieldSelect.svelte"
  import Checkbox from "./PropertyControls/Checkbox.svelte"
  import TableSelect from "./PropertyControls/TableSelect.svelte"
  import TableViewSelect from "./PropertyControls/TableViewSelect.svelte"
  import TableViewFieldSelect from "./PropertyControls/TableViewFieldSelect.svelte"
  import EventsEditor from "./PropertyControls/EventsEditor"
  import ScreenSelect from "./PropertyControls/ScreenSelect.svelte"
  import DetailScreenSelect from "./PropertyControls/DetailScreenSelect.svelte"
  import IconSelect from "./PropertyControls/IconSelect"
  import ColorPicker from "./PropertyControls/ColorPicker.svelte"

  export let componentDefinition = {}
  export let componentInstance = {}
  export let assetInstance
  export let onChange = () => {}
  export let onScreenPropChange = () => {}
  export let showDisplayName = false

  const layoutDefinition = []
  const screenDefinition = [
    { key: "description", label: "Description", control: Input },
    { key: "routing.route", label: "Route", control: Input },
    { key: "routing.roleId", label: "Access", control: RoleSelect },
    { key: "layoutId", label: "Layout", control: LayoutSelect },
  ]
  const assetProps = [
    "title",
    "description",
    "routing.route",
    "layoutId",
    "routing.roleId",
  ]

  $: settings = componentDefinition?.settings ?? []
  $: isLayout = assetInstance && assetInstance.favicon
  $: assetDefinition = isLayout ? layoutDefinition : screenDefinition

  const controlMap = {
    text: Input,
    select: OptionSelect,
    datasource: TableViewSelect,
    screen: ScreenSelect,
    detailScreen: DetailScreenSelect,
    boolean: Checkbox,
    number: Input,
    event: EventsEditor,
    table: TableSelect,
    color: ColorPicker,
    icon: IconSelect,
    field: TableViewFieldSelect,
    multifield: MultiTableViewFieldSelect,
  }

  const getControl = type => {
    return controlMap[type]
  }

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

  const onInstanceNameChange = name => {
    onChange("_instanceName", name)
  }
</script>

<div class="settings-view-container">
  {#if assetInstance}
    {#each assetDefinition as def (`${componentInstance._id}-${def.key}`)}
      <PropertyControl
        bindable={false}
        control={def.control}
        label={def.label}
        key={def.key}
        value={get(assetInstance, def.key)}
        onChange={val => onScreenPropChange(def.key, val)} />
    {/each}
  {/if}

  {#if showDisplayName}
    <PropertyControl
      bindable={false}
      control={Input}
      label="Name"
      key="_instanceName"
      value={componentInstance._instanceName}
      onChange={onInstanceNameChange} />
  {/if}

  {#if settings && settings.length > 0}
    {#each settings as setting (`${componentInstance._id}-${setting.key}`)}
      {#if canRenderControl(setting)}
        <PropertyControl
          type={setting.type}
          control={getControl(setting.type)}
          label={setting.label}
          key={setting.key}
          value={componentInstance[setting.key] ?? componentInstance[setting.key]?.defaultValue}
          {componentInstance}
          onChange={val => onChange(setting.key, val)}
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
