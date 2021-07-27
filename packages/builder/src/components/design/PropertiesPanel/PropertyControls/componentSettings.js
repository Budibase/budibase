import { Checkbox, Input, Select } from "@budibase/bbui"
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
import StringFieldSelect from "./StringFieldSelect.svelte"
import NumberFieldSelect from "./NumberFieldSelect.svelte"
import OptionsFieldSelect from "./OptionsFieldSelect.svelte"
import BooleanFieldSelect from "./BooleanFieldSelect.svelte"
import LongFormFieldSelect from "./LongFormFieldSelect.svelte"
import DateTimeFieldSelect from "./DateTimeFieldSelect.svelte"
import AttachmentFieldSelect from "./AttachmentFieldSelect.svelte"
import RelationshipFieldSelect from "./RelationshipFieldSelect.svelte"

const componentMap = {
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

export const getComponentForSettingType = type => {
  return componentMap[type]
}
