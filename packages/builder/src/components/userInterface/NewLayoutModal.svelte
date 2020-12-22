<script>
  import { goto } from "@sveltech/routify"
  import { notifier } from "builderStore/store/notifications"
  import { store } from "builderStore"
  import { Input, ModalContent } from "@budibase/bbui"

  let name = ""

  async function save() {
    try {
      const layout = await store.actions.layouts.save({ name })
      $goto(`./${layout._id}`)
      notifier.success(`Layout ${name} created successfully`)
    } catch (err) {
      notifier.danger(`Error creating layout ${name}.`)
    }
  }
</script>

<ModalContent title="Create Layout" confirmText="Create" onConfirm={save}>
  <Input thin label="Name" bind:value={name} />
</ModalContent>
