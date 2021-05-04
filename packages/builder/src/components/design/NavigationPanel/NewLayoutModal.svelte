<script>
  import { goto } from "@roxi/routify"
  import { notifications } from "@budibase/bbui"
  import { store } from "builderStore"
  import { Input, ModalContent } from "@budibase/bbui"

  let name = ""

  async function save() {
    try {
      await store.actions.layouts.save({ name })
      notifications.success(`Layout ${name} created successfully`)
    } catch (err) {
      notifications.error(`Error creating layout ${name}.`)
    }
  }
</script>

<ModalContent title="Create Layout" confirmText="Create" onConfirm={save}>
  <Input thin label="Name" bind:value={name} />
</ModalContent>
