import NavigateTo from "./NavigateTo.svelte"
import SaveRecord from "./SaveRecord.svelte"

// defines what actions are available, when adding a new one
// the component is the setup panel for the action
// NOTE that the "name" is used by the client library,
// so if you want to change it, you must change it client lib too

export default [
  {
    name: "Save Record",
    component: SaveRecord,
  },
  {
    name: "Navigate To",
    component: NavigateTo,
  },
]
