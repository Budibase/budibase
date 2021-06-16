<script>
  import { Input, notifications, ModalContent } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { views as viewsStore } from "stores/backend"
  import { tables } from "stores/backend"
  import analytics from "analytics"

  let name
  let field

  $: views = $tables.list.flatMap(table => Object.keys(table.views || {}))

  function saveView() {
    if (views.includes(name)) {
      notifications.error(`View exists with name ${name}.`)
      return
    }
    viewsStore.save({
      name,
      tableId: $tables.selected._id,
      field,
    })
    notifications.success(`View ${name} created`)
    analytics.captureEvent("View Created", { name })
    $goto(`../../view/${name}`)
  }
</script>

<ModalContent
  title="Create View"
  confirmText="Create View"
  onConfirm={saveView}
>
  <Input label="View Name" thin bind:value={name} />
</ModalContent>
