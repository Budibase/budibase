<script>
  import { isEmpty } from "lodash/fp"
  import { Checkbox, Input, Select, DetailSummary } from "@budibase/bbui"
  import { store } from "builderStore"
  import PropertyControl from "./PropertyControls/PropertyControl.svelte"
  import LayoutSelect from "./PropertyControls/LayoutSelect.svelte"
  import RoleSelect from "./PropertyControls/RoleSelect.svelte"
  import TableSelect from "./PropertyControls/TableSelect.svelte"
  import DataSourceSelect from "./PropertyControls/DataSourceSelect.svelte"
  import DataProviderSelect from "./PropertyControls/DataProviderSelect.svelte"
  import FieldSelect from "./PropertyControls/FieldSelect.svelte"
  import MultiFieldSelect from "./PropertyControls/MultiFieldSelect.svelte"
  import SchemaSelect from "./PropertyControls/SchemaSelect.svelte"
  import SectionSelect from "./PropertyControls/SectionSelect.svelte"
  import NavigationEditor from "./PropertyControls/NavigationEditor/NavigationEditor.svelte"
  import EventsEditor from "./PropertyControls/EventsEditor"
  import FilterEditor from "./PropertyControls/FilterEditor/FilterEditor.svelte"
  import { IconSelect } from "./PropertyControls/IconSelect"
  import StringFieldSelect from "./PropertyControls/StringFieldSelect.svelte"
  import NumberFieldSelect from "./PropertyControls/NumberFieldSelect.svelte"
  import OptionsFieldSelect from "./PropertyControls/OptionsFieldSelect.svelte"
  import BooleanFieldSelect from "./PropertyControls/BooleanFieldSelect.svelte"
  import LongFormFieldSelect from "./PropertyControls/LongFormFieldSelect.svelte"
  import DateTimeFieldSelect from "./PropertyControls/DateTimeFieldSelect.svelte"
  import AttachmentFieldSelect from "./PropertyControls/AttachmentFieldSelect.svelte"
  import RelationshipFieldSelect from "./PropertyControls/RelationshipFieldSelect.svelte"
  import ResetFieldsButton from "./PropertyControls/ResetFieldsButton.svelte"
  import ColorPicker from "./PropertyControls/ColorPicker.svelte"
  import URLSelect from "./PropertyControls/URLSelect.svelte"

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
  const controlMap = {
    text: Input,
    select: Select,
    dataSource: DataSourceSelect,
    dataProvider: DataProviderSelect,
    boolean: Checkbox,
    number: Input,
    event: EventsEditor,
    table: TableSelect,
    color: ColorPicker,
    icon: IconSelect,
    field: FieldSelect,
    multifield: MultiFieldSelect,
    schema: SchemaSelect,
    section: SectionSelect,
    navigation: NavigationEditor,
    filter: FilterEditor,
    url: URLSelect,
    "field/string": StringFieldSelect,
    "field/number": NumberFieldSelect,
    "field/options": OptionsFieldSelect,
    "field/boolean": BooleanFieldSelect,
    "field/longform": LongFormFieldSelect,
    "field/datetime": DateTimeFieldSelect,
    "field/attachment": AttachmentFieldSelect,
    "field/link": RelationshipFieldSelect,
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
    {#each settings as setting (`${componentInstance._id}-${setting.key}`)}
      {#if canRenderControl(setting)}
        <PropertyControl
          type={setting.type}
          control={getControl(setting.type)}
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
