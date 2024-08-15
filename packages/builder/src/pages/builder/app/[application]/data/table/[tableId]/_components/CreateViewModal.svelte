<script>
  import { Modal, Input, notifications, ModalContent } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { viewsV2 } from "stores/builder"

  export let table

  let name
  let modal

  $: views = Object.keys(table?.views || {}).map(x => x.toLowerCase())
  $: nameExists = views.includes(name?.trim().toLowerCase())

  export const show = () => {
    name = null
    modal?.show()
  }

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
        tableId: table._id,
        schema: enrichSchema(table.schema),
        primaryDisplay: table.primaryDisplay,
      })
      notifications.success(`View ${name} created`)
      $goto(`./${newView.id}`)
    } catch (error) {
      notifications.error("Error creating view")
    }
  }
</script>

<Modal bind:this={modal}>
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
</Modal>
