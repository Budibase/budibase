<script>
  import { Select, ModalContent, notifications } from "@budibase/bbui"
  import { tables, views } from "@/stores/builder"
  import { FIELDS } from "@/constants/backend"

  export let view = {}

  $: viewTable = $tables.list.find(
    ({ _id }) => _id === $views.selected?.tableId
  )
  $: fields =
    viewTable &&
    Object.entries(viewTable.schema)
      .filter(
        entry =>
          entry[1].type !== FIELDS.LINK.type &&
          entry[1].type !== FIELDS.FORMULA.type
      )
      .map(([key]) => key)

  function saveView() {
    try {
      views.save(view)
      notifications.success(`View ${view.name} saved`)
    } catch (error) {
      notifications.error("Error saving view")
    }
  }
</script>

<ModalContent title="Group By" confirmText="Save" onConfirm={saveView}>
  <Select bind:value={view.groupBy} options={fields} />
</ModalContent>
