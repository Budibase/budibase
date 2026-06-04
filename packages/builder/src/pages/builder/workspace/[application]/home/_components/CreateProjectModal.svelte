<script lang="ts">
  import {
    Body,
    ColorPicker,
    Input,
    keepOpen,
    ModalContent,
    TextArea,
  } from "@budibase/bbui"

  interface ConfirmPayload {
    name: string
    description?: string
    color?: string
  }

  export let onConfirm: (_payload: ConfirmPayload) => unknown = () => {}

  let name = ""
  let description = ""
  let color = "#8CA171"
  let nameError: string | undefined = undefined

  $: if (name.trim()) {
    nameError = undefined
  }

  const confirm = () => {
    if (!name.trim()) {
      nameError = "Name is required"
      return keepOpen
    }

    return onConfirm({
      name: name.trim(),
      description: description.trim() || undefined,
      color: color.trim() || undefined,
    })
  }
</script>

<ModalContent
  title="Create project"
  confirmText="Create"
  size="M"
  onConfirm={confirm}
>
  <Input bind:value={name} label="Name" error={nameError} />
  <TextArea
    bind:value={description}
    label="Description"
    minHeight={96}
    placeholder="What does this project cover?"
  />

  <div class="color-field">
    <Body size="S" weight="600">Color</Body>
    <ColorPicker bind:value={color} on:change={e => (color = e.detail)} />
  </div>
</ModalContent>

<style>
  .color-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>
