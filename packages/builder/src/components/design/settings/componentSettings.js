import { Checkbox, Select, RadioGroup, Stepper } from "@budibase/bbui"
import DataSourceSelect from "./controls/DataSourceSelect.svelte"
import S3DataSourceSelect from "./controls/S3DataSourceSelect.svelte"
import DataProviderSelect from "./controls/DataProviderSelect.svelte"
import ButtonActionEditor from "./controls/ButtonActionEditor/ButtonActionEditor.svelte"
import TableSelect from "./controls/TableSelect.svelte"
import ColorPicker from "./controls/ColorPicker.svelte"
import { IconSelect } from "./controls/IconSelect"
import FieldSelect from "./controls/FieldSelect.svelte"
import SortableFieldSelect from "./controls/SortableFieldSelect.svelte"
import MultiFieldSelect from "./controls/MultiFieldSelect.svelte"
import SearchFieldSelect from "./controls/SearchFieldSelect.svelte"
import SchemaSelect from "./controls/SchemaSelect.svelte"
import SectionSelect from "./controls/SectionSelect.svelte"
import FilterEditor from "./controls/FilterEditor/FilterEditor.svelte"
import URLSelect from "./controls/URLSelect.svelte"
import OptionsEditor from "./controls/OptionsEditor/OptionsEditor.svelte"
import FormFieldSelect from "./controls/FormFieldSelect.svelte"
import ValidationEditor from "./controls/ValidationEditor/ValidationEditor.svelte"
import DrawerBindableCombobox from "components/common/bindings/DrawerBindableCombobox.svelte"
import ColumnEditor from "./controls/ColumnEditor/ColumnEditor.svelte"
import BasicColumnEditor from "./controls/ColumnEditor/BasicColumnEditor.svelte"
import BarButtonList from "./controls/BarButtonList.svelte"

const componentMap = {
  text: DrawerBindableCombobox,
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
  url: URLSelect,
  columns: ColumnEditor,
  "columns/basic": BasicColumnEditor,
  "field/sortable": SortableFieldSelect,
  "field/string": FormFieldSelect,
  "field/number": FormFieldSelect,
  "field/options": FormFieldSelect,
  "field/boolean": FormFieldSelect,
  "field/longform": FormFieldSelect,
  "field/datetime": FormFieldSelect,
  "field/attachment": FormFieldSelect,
  "field/link": FormFieldSelect,
  "field/array": FormFieldSelect,
  "field/json": FormFieldSelect,
  "field/barcode/qr": FormFieldSelect,
  // Some validation types are the same as others, so not all types are
  // explicitly listed here. e.g. options uses string validation
  "validation/string": ValidationEditor,
  "validation/array": ValidationEditor,
  "validation/number": ValidationEditor,
  "validation/boolean": ValidationEditor,
  "validation/datetime": ValidationEditor,
  "validation/attachment": ValidationEditor,
  "validation/link": ValidationEditor,
}

export const getComponentForSetting = setting => {
  const { type, showInBar, barStyle } = setting || {}
  if (!type) {
    return null
  }

  // We can show a clone of the bar settings for certain select settings
  if (showInBar && type === "select" && barStyle === "buttons") {
    return BarButtonList
  }

  return componentMap[type]
}
