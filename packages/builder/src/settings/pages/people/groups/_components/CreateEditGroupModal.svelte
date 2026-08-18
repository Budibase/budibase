<script lang="ts">
  import {
    keepOpen,
    ColorPicker,
    Body,
    ModalContent,
    Input,
    IconPicker,
  } from "@budibase/bbui"
  import type { UserGroup } from "@budibase/types"

  interface Props {
    group: UserGroup
    saveGroup: (group: UserGroup) => void | Promise<void>
  }

  let { group, saveGroup }: Props = $props()

  const readonlyTitle = $derived(group?.scimInfo?.isSync)
  let nameError = $state<string | undefined>()
</script>

<ModalContent
  onConfirm={() => {
    if (!group.name?.trim()) {
      nameError = "Group name cannot be empty"
      return keepOpen
    }
    saveGroup(group)
  }}
  size="M"
  title={group?._rev ? "Edit group" : "Create group"}
  confirmText="Save"
>
  <Input
    bind:value={group.name}
    label="Name"
    error={nameError}
    disabled={readonlyTitle}
  />
  <div class="modal-format">
    <div class="modal-inner">
      <Body size="XS">Icon</Body>
      <div class="modal-spacing">
        <IconPicker
          bind:value={group.icon}
          on:change={e => (group.icon = e.detail)}
        />
      </div>
    </div>
    <div class="modal-inner">
      <Body size="XS">Color</Body>
      <div class="modal-spacing">
        <ColorPicker
          bind:value={group.color}
          on:change={e => (group.color = e.detail)}
        />
      </div>
    </div>
  </div>
</ModalContent>

<style>
  .modal-format {
    display: flex;
    justify-content: space-between;
    width: 40%;
  }

  .modal-inner {
    display: flex;
    align-items: center;
  }

  .modal-spacing {
    margin-left: var(--spacing-l);
  }
</style>
