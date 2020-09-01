import NavigateTo from "./NavigateTo.svelte"
import UpdateRecord from "./UpdateRecord.svelte"
import CreateRecord from "./CreateRecord.svelte"

export default [
  {
    name: "Create Record",
    component: CreateRecord,
  },
  {
    name: "Navigate To",
    component: NavigateTo,
  },
  {
    name: "Update Record",
    component: UpdateRecord,
  },
]
