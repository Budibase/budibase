<svelte:options runes={true} />

<script lang="ts">
  import {
    Body,
    ColorPicker,
    Input,
    keepOpen,
    ModalContent,
    TextArea,
  } from "@budibase/bbui"
  import { helpers } from "@budibase/shared-core"
  import type { ProjectFormPayload, ProjectResponse } from "@budibase/types"

  interface Props {
    onConfirm?: (_payload: ProjectFormPayload) => unknown
    project?: ProjectResponse
  }

  let { onConfirm = () => {}, project = undefined }: Props = $props()

  let name = $state(project?.name || "")
  let description = $state(project?.description || "")
  let color = $state(project ? project.color || "" : "#8CA171")
  let nameError: string | undefined = $state(undefined)
  let colorError: string | undefined = $state(undefined)

  $effect(() => {
    if (name.trim()) {
      nameError = undefined
    }
    color
    colorError = undefined
  })

  const confirm = () => {
    if (!name.trim()) {
      nameError = "Name is required"
      return keepOpen
    }

    let normalizedColor: string | undefined
    try {
      normalizedColor = helpers.normaliseSafeCssColor(color)
    } catch {
      colorError = "Color is invalid"
      return keepOpen
    }

    return onConfirm({
      name: name.trim(),
      description: description.trim() || undefined,
      color: normalizedColor,
    })
  }
</script>

<ModalContent
  title={project ? "Edit project" : "Create project"}
  confirmText={project ? "Save" : "Create"}
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
    <ColorPicker bind:value={color} on:change={e => (color = e.detail || "")} />
    {#if colorError}
      <Body size="S" color="var(--spectrum-semantic-negative-color-default)">
        {colorError}
      </Body>
    {/if}
  </div>
</ModalContent>

<style>
  .color-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>
