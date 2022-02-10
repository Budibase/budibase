<script>
  import { notifications } from "@budibase/bbui"
  import { store } from "builderStore"
  import { Input, ModalContent } from "@budibase/bbui"

  let name = ""

  async function save() {
    try {
      await store.actions.layouts.save({ name })
      notifications.success(`Layout ${name} created successfully`)
    } catch (error) {
      notifications.error("Error creating layout")
    }
  }
</script>

<ModalContent title="Create Layout" confirmText="Create" onConfirm={save}>
  <Input thin label="Name" bind:value={name} />
</ModalContent>
