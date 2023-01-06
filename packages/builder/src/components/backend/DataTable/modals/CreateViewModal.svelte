<script>
  import { Input, notifications, ModalContent } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { views as viewsStore } from "stores/backend"
  import { tables } from "stores/backend"

  let name
  let field

  $: views = $tables.list.flatMap(table => Object.keys(table.views || {}))

  const saveView = async () => {
    name = name?.trim()
    if (views.includes(name)) {
      notifications.error(`View exists with name ${name}`)
      return
    }
    try {
      await viewsStore.save({
        name,
        tableId: $tables.selected._id,
        field,
      })
      notifications.success(`View ${name} created`)
      $goto(`../../view/${encodeURIComponent(name)}`)
    } catch (error) {
      notifications.error("Error creating view")
    }
  }
</script>

<ModalContent
  title="Create View"
  confirmText="Create View"
  onConfirm={saveView}
>
  <Input label="View Name" thin bind:value={name} />
</ModalContent>
