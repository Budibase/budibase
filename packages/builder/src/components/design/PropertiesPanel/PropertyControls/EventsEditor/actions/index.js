import NavigateTo from "./NavigateTo.svelte"
import SaveRow from "./SaveRow.svelte"
import DeleteRow from "./DeleteRow.svelte"
import ExecuteQuery from "./ExecuteQuery.svelte"
import TriggerAutomation from "./TriggerAutomation.svelte"
import ValidateForm from "./ValidateForm.svelte"
import RefreshDatasource from "./RefreshDatasource.svelte"

// defines what actions are available, when adding a new one
// the component is the setup panel for the action
// NOTE that the "name" is used by the client library,
// so if you want to change it, you must change it client lib too

export default [
  {
    name: "Save Row",
    component: SaveRow,
  },
  {
    name: "Delete Row",
    component: DeleteRow,
  },
  {
    name: "Navigate To",
    component: NavigateTo,
  },
  {
    name: "Execute Query",
    component: ExecuteQuery,
  },
  {
    name: "Trigger Automation",
    component: TriggerAutomation,
  },
  {
    name: "Validate Form",
    component: ValidateForm,
  },
  {
    name: "Refresh Datasource",
    component: RefreshDatasource,
  },
]
