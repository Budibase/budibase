<script>
  import { getContext } from "svelte"
  import { Input, notifications, ModalContent } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { viewsV2 } from "stores/backend"
  import { tables } from "stores/backend"
  import { LuceneUtils } from "@budibase/frontend-core"

  const { filter, sort, table } = getContext("grid")

  $: query = LuceneUtils.buildLuceneQuery($filter)
  $: console.log($table.schema)

  let name

  $: views = Object.keys($tables.selected?.views || {})
  $: nameExists = views.includes(name?.trim())

  const saveView = async () => {
    name = name?.trim()
    try {
      const newView = await viewsV2.create({
        name,
        tableId: $tables.selected._id,
        query,
        sort: {
          field: $sort.column,
          order: $sort.order,
        },
        columns: $table.schema,
      })
      notifications.success(`View ${name} created`)
      $goto(`../../view/v2/${newView.id}`)
    } catch (error) {
      notifications.error("Error creating view")
    }
  }
</script>

<ModalContent
  title="Create View"
  confirmText="Create View"
  onConfirm={saveView}
  disabled={nameExists}
>
  <Input
    label="View Name"
    thin
    bind:value={name}
    error={nameExists ? "A view already exists with that name" : null}
  />
</ModalContent>
