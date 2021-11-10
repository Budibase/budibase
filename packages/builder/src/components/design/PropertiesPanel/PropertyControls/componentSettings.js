import { Checkbox, Select, Stepper } from "@budibase/bbui"
import DataSourceSelect from "./DataSourceSelect.svelte"
import DataProviderSelect from "./DataProviderSelect.svelte"
import EventsEditor from "./EventsEditor"
import TableSelect from "./TableSelect.svelte"
import ColorPicker from "./ColorPicker.svelte"
import { IconSelect } from "./IconSelect"
import FieldSelect from "./FieldSelect.svelte"
import MultiFieldSelect from "./MultiFieldSelect.svelte"
import SchemaSelect from "./SchemaSelect.svelte"
import SectionSelect from "./SectionSelect.svelte"
import NavigationEditor from "./NavigationEditor/NavigationEditor.svelte"
import FilterEditor from "./FilterEditor/FilterEditor.svelte"
import URLSelect from "./URLSelect.svelte"
import OptionsEditor from "./OptionsEditor/OptionsEditor.svelte"
import FormFieldSelect from "./FormFieldSelect.svelte"
import ValidationEditor from "./ValidationEditor/ValidationEditor.svelte"
import DrawerBindableCombobox from "components/common/bindings/DrawerBindableCombobox.svelte"

const componentMap = {
  text: DrawerBindableCombobox,
  select: Select,
  dataSource: DataSourceSelect,
  dataProvider: DataProviderSelect,
  boolean: Checkbox,
  number: Stepper,
  event: EventsEditor,
  table: TableSelect,
  color: ColorPicker,
  icon: IconSelect,
  field: FieldSelect,
  multifield: MultiFieldSelect,
  options: OptionsEditor,
  schema: SchemaSelect,
  section: SectionSelect,
  navigation: NavigationEditor,
  filter: FilterEditor,
  url: URLSelect,
  "field/string": FormFieldSelect,
  "field/number": FormFieldSelect,
  "field/options": FormFieldSelect,
  "field/boolean": FormFieldSelect,
  "field/longform": FormFieldSelect,
  "field/datetime": FormFieldSelect,
  "field/attachment": FormFieldSelect,
  "field/link": FormFieldSelect,
  "field/array": FormFieldSelect,
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

export const getComponentForSettingType = type => {
  return componentMap[type]
}
