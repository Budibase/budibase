<script>
  import { Select, ModalContent, notifications } from "@budibase/bbui"
  import { tables, views } from "@/stores/builder"
  import { FIELDS } from "@/constants/backend"
  import { isStaticFormula } from "@budibase/types"

  export let view = {}

  $: viewTable = $tables.list.find(
    ({ _id }) => _id === $views.selected?.tableId
  )
  $: fields =
    viewTable &&
    Object.entries(viewTable.schema)
      .filter(entry => {
        const fieldSchema = entry[1]
        // Don't allow linking columns
        if (fieldSchema.type === FIELDS.LINK.type) {
          return false
        }
        // Don't allow formula columns unless they're static
        if (fieldSchema.type === FIELDS.FORMULA.type) {
          return isStaticFormula(fieldSchema)
        }
        return true
      })
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
