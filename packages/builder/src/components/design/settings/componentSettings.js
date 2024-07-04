import { Checkbox, Input, RadioGroup, Select, Stepper } from "@budibase/bbui"
import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
import { licensing } from "stores/portal"
import { get } from "svelte/store"
import BarButtonList from "./controls/BarButtonList.svelte"
import ButtonActionEditor from "./controls/ButtonActionEditor/ButtonActionEditor.svelte"
import ButtonConfiguration from "./controls/ButtonConfiguration/ButtonConfiguration.svelte"
import ColorPicker from "./controls/ColorPicker.svelte"
import BasicColumnEditor from "./controls/ColumnEditor/BasicColumnEditor.svelte"
import ColumnEditor from "./controls/ColumnEditor/ColumnEditor.svelte"
import DataProviderSelect from "./controls/DataProviderSelect.svelte"
import DataSourceSelect from "./controls/DataSourceSelect/DataSourceSelect.svelte"
import FieldConfiguration from "./controls/FieldConfiguration/FieldConfiguration.svelte"
import FieldSelect from "./controls/FieldSelect.svelte"
import FilterEditor from "./controls/FilterEditor/FilterEditor.svelte"
import FormFieldSelect from "./controls/FormFieldSelect.svelte"
import FormStepConfiguration from "./controls/FormStepConfiguration.svelte"
import FormStepControls from "./controls/FormStepControls.svelte"
import GridColumnEditor from "./controls/GridColumnConfiguration/GridColumnConfiguration.svelte"
import { IconSelect } from "./controls/IconSelect"
import MultiFieldSelect from "./controls/MultiFieldSelect.svelte"
import OptionsEditor from "./controls/OptionsEditor/OptionsEditor.svelte"
import PaywalledSetting from "./controls/PaywalledSetting.svelte"
import RelationshipFilterEditor from "./controls/RelationshipFilterEditor.svelte"
import S3DataSourceSelect from "./controls/S3DataSourceSelect.svelte"
import SchemaSelect from "./controls/SchemaSelect.svelte"
import SearchFieldSelect from "./controls/SearchFieldSelect.svelte"
import SectionSelect from "./controls/SectionSelect.svelte"
import SortableFieldSelect from "./controls/SortableFieldSelect.svelte"
import TableSelect from "./controls/TableSelect.svelte"
import URLSelect from "./controls/URLSelect.svelte"
import ValidationEditor from "./controls/ValidationEditor/ValidationEditor.svelte"

const componentMap = {
  text: DrawerBindableInput,
  plainText: Input,
  select: Select,
  radio: RadioGroup,
  dataSource: DataSourceSelect,
  "dataSource/s3": S3DataSourceSelect,
  dataProvider: DataProviderSelect,
  boolean: Checkbox,
  number: Stepper,
  event: ButtonActionEditor,
  table: TableSelect,
  color: ColorPicker,
  icon: IconSelect,
  field: FieldSelect,
  multifield: MultiFieldSelect,
  searchfield: SearchFieldSelect,
  options: OptionsEditor,
  schema: SchemaSelect,
  section: SectionSelect,
  filter: FilterEditor,
  "filter/relationship": RelationshipFilterEditor,
  url: URLSelect,
  fieldConfiguration: FieldConfiguration,
  buttonConfiguration: ButtonConfiguration,
  stepConfiguration: FormStepConfiguration,
  formStepControls: FormStepControls,
  columns: ColumnEditor,
  "columns/basic": BasicColumnEditor,
  "columns/grid": GridColumnEditor,
  "field/sortable": SortableFieldSelect,
  "field/string": FormFieldSelect,
  "field/number": FormFieldSelect,
  "field/bigint": FormFieldSelect,
  "field/options": FormFieldSelect,
  "field/boolean": FormFieldSelect,
  "field/longform": FormFieldSelect,
  "field/datetime": FormFieldSelect,
  "field/attachment": FormFieldSelect,
  "field/attachment_single": FormFieldSelect,
  "field/s3": Input,
  "field/link": FormFieldSelect,
  "field/array": FormFieldSelect,
  "field/json": FormFieldSelect,
  "field/barcodeqr": FormFieldSelect,
  "field/signature_single": FormFieldSelect,
  "field/bb_reference": FormFieldSelect,
  // Some validation types are the same as others, so not all types are
  // explicitly listed here. e.g. options uses string validation
  "validation/string": ValidationEditor,
  "validation/array": ValidationEditor,
  "validation/number": ValidationEditor,
  "validation/boolean": ValidationEditor,
  "validation/datetime": ValidationEditor,
  "validation/attachment": ValidationEditor,
  "validation/attachment_single": ValidationEditor,
  "validation/signature_single": ValidationEditor,
  "validation/link": ValidationEditor,
  "validation/bb_reference": ValidationEditor,
}

export const getComponentForSetting = setting => {
  const { type, showInBar, barStyle, license } = setting || {}
  if (!type) {
    return null
  }

  // Check for paywalled settings
  if (license && get(licensing).isFreePlan) {
    return PaywalledSetting
  }

  // We can show a clone of the bar settings for certain select settings
  if (showInBar && type === "select" && barStyle === "buttons") {
    return BarButtonList
  }

  return componentMap[type]
}
