<script>
  import { Modal, Input, notifications, ModalContent } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { viewsV2 } from "stores/builder"

  export let table

  let name
  let modal

  $: views = Object.keys(table?.views || {}).map(x => x.toLowerCase())
  $: trimmedName = name?.trim()
  $: nameExists = views.includes(trimmedName?.toLowerCase())
  $: nameValid = trimmedName?.length && !nameExists

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
    try {
      const newView = await viewsV2.create({
        name: trimmedName,
        tableId: table._id,
        schema: enrichSchema(table.schema),
        primaryDisplay: table.primaryDisplay,
      })
      notifications.success(`View ${name} created`)
      name = null
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
    disabled={!nameValid}
  >
    <Input
      label="View name"
      thin
      bind:value={name}
      error={nameExists ? "A view already exists with that name" : null}
    />
  </ModalContent>
</Modal>
