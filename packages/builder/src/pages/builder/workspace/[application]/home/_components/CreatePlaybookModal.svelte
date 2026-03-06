<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Input, ModalContent } from "@budibase/bbui"

  const dispatch = createEventDispatcher<{
    confirm: {
      name: string
      description?: string
      color?: string
    }
  }>()

  let name = ""
  let description = ""
  let color = "#8CA171"

  const confirm = () => {
    dispatch("confirm", {
      name: name.trim(),
      description: description.trim() || undefined,
      color: color.trim() || undefined,
    })
  }
</script>

<ModalContent
  title="Create playbook"
  confirmText="Create"
  size="M"
  canConfirm={!!name.trim()}
  onConfirm={confirm}
>
  <Input bind:value={name} label="Name" />
  <Input bind:value={description} label="Description" />
  <Input bind:value={color} label="Color" />
</ModalContent>
