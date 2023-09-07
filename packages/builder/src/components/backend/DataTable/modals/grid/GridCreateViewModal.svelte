<script>
  import { getContext } from "svelte"
  import { Input, notifications, ModalContent } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { viewsV2 } from "stores/backend"

  const { filter, sort, definition } = getContext("grid")

  let name

  $: views = Object.keys($definition?.views || {}).map(x => x.toLowerCase())
  $: nameExists = views.includes(name?.trim().toLowerCase())

  const enrichSchema = schema => {
    // We need to sure that "visible" is set to true for any fields which have
    // not yet been saved with grid metadata attached
    const cloned = { ...schema }
    Object.entries(cloned).forEach(([field, fieldSchema]) => {
      if (fieldSchema.visible == null) {
        cloned[field] = { ...cloned[field], visible: true }
      }
    })
    return cloned
  }

  const saveView = async () => {
    name = name?.trim()
    try {
      const newView = await viewsV2.create({
        name,
        tableId: $definition._id,
        query: $filter,
        sort: {
          field: $sort.column,
          order: $sort.order,
        },
        schema: enrichSchema($definition.schema),
        primaryDisplay: $definition.primaryDisplay,
      })
      notifications.success(`View ${name} created`)
      $goto(`../../view/v2/${newView.id}`)
    } catch (error) {
      notifications.error("Error creating view")
    }
  }
</script>

<ModalContent
  title="Create view"
  confirmText="Create view"
  onConfirm={saveView}
  disabled={nameExists}
>
  <Input
    label="View name"
    thin
    bind:value={name}
    error={nameExists ? "A view already exists with that name" : null}
  />
</ModalContent>
