<script>
  import { get } from "lodash"
  import { isEmpty } from "lodash/fp"
  import { Button } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { currentAsset } from "builderStore"
  import { findClosestMatchingComponent } from "builderStore/storeUtils"
  import { makeDatasourceFormComponents } from "builderStore/store/screenTemplates/utils/commonComponents"
  import PropertyControl from "./PropertyControls/PropertyControl.svelte"
  import Input from "./PropertyControls/Input.svelte"
  import LayoutSelect from "./PropertyControls/LayoutSelect.svelte"
  import RoleSelect from "./PropertyControls/RoleSelect.svelte"
  import OptionSelect from "./PropertyControls/OptionSelect.svelte"
  import Checkbox from "./PropertyControls/Checkbox.svelte"
  import TableSelect from "./PropertyControls/TableSelect.svelte"
  import DatasourceSelect from "./PropertyControls/DatasourceSelect.svelte"
  import FieldSelect from "./PropertyControls/FieldSelect.svelte"
  import MultiFieldSelect from "./PropertyControls/MultiFieldSelect.svelte"
  import SchemaSelect from "./PropertyControls/SchemaSelect.svelte"
  import EventsEditor from "./PropertyControls/EventsEditor"
  import FilterEditor from "./PropertyControls/FilterEditor.svelte"
  import DetailScreenSelect from "./PropertyControls/DetailScreenSelect.svelte"
  import { IconSelect } from "./PropertyControls/IconSelect"
  import ColorPicker from "./PropertyControls/ColorPicker.svelte"
  import StringFieldSelect from "./PropertyControls/StringFieldSelect.svelte"
  import NumberFieldSelect from "./PropertyControls/NumberFieldSelect.svelte"
  import OptionsFieldSelect from "./PropertyControls/OptionsFieldSelect.svelte"
  import BooleanFieldSelect from "./PropertyControls/BooleanFieldSelect.svelte"
  import LongFormFieldSelect from "./PropertyControls/LongFormFieldSelect.svelte"
  import DateTimeFieldSelect from "./PropertyControls/DateTimeFieldSelect.svelte"
  import AttachmentFieldSelect from "./PropertyControls/AttachmentFieldSelect.svelte"
  import RelationshipFieldSelect from "./PropertyControls/RelationshipFieldSelect.svelte"

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
  let confirmResetFieldsDialog

  $: settings = componentDefinition?.settings ?? []
  $: isLayout = assetInstance && assetInstance.favicon
  $: assetDefinition = isLayout ? layoutDefinition : screenDefinition

  const controlMap = {
    text: Input,
    select: OptionSelect,
    datasource: DatasourceSelect,
    detailScreen: DetailScreenSelect,
    boolean: Checkbox,
    number: Input,
    event: EventsEditor,
    table: TableSelect,
    color: ColorPicker,
    icon: IconSelect,
    field: FieldSelect,
    multifield: MultiFieldSelect,
    schema: SchemaSelect,
    filter: FilterEditor,
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

  const onInstanceNameChange = name => {
    onChange("_instanceName", name)
  }

  const resetFormFields = () => {
    const form = findClosestMatchingComponent(
      $currentAsset.props,
      componentInstance._id,
      component => component._component.endsWith("/form")
    )
    const datasource = form?.datasource
    const fields = makeDatasourceFormComponents(datasource)
    onChange(
      "_children",
      fields.map(field => field.json())
    )
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
          props={{ options: setting.options, placeholder: setting.placeholder }} />
      {/if}
    {/each}
  {:else}
    <div class="empty">
      This component doesn't have any additional settings.
    </div>
  {/if}

  {#if componentDefinition?.component?.endsWith('/fieldgroup')}
    <Button secondary wide on:click={() => confirmResetFieldsDialog?.show()}>
      Reset Fields
    </Button>
  {/if}
</div>
<ConfirmDialog
  bind:this={confirmResetFieldsDialog}
  body={`All components inside this group will be deleted and replaced with fields to match the schema. Are you sure you want to reset this Field Group?`}
  okText="Reset"
  onOk={resetFormFields}
  title="Confirm Reset Fields" />

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
