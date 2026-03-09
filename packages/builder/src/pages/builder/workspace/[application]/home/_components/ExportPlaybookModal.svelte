<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Body, Input, ModalContent, Select, Toggle } from "@budibase/bbui"
  import type { PlaybookResponse } from "@budibase/types"

  export let playbooks: PlaybookResponse[] = []
  export let selectedPlaybookId = ""

  const dispatch = createEventDispatcher<{
    confirm: {
      id: string
      encryptPassword?: string
    }
  }>()

  let playbookId = ""
  let encrypted = false
  let encryptPassword = ""

  $: if (selectedPlaybookId) {
    playbookId = selectedPlaybookId
  } else if (!playbookId && playbooks.length === 1) {
    playbookId = playbooks[0]._id
  }

  $: disabled = !playbookId || (encrypted && !encryptPassword.trim())
</script>

<ModalContent
  title="Export playbook"
  confirmText="Export"
  size="M"
  bind:disabled
  onConfirm={() =>
    dispatch("confirm", {
      id: playbookId,
      encryptPassword: encrypted ? encryptPassword.trim() : undefined,
    })}
>
  <Body size="S">
    Export a portable Playbook package for use in another workspace.
  </Body>

  <Select
    label="Playbook"
    bind:value={playbookId}
    options={playbooks}
    getOptionLabel={playbook => playbook.name}
    getOptionValue={playbook => playbook._id}
    getOptionColour={playbook => playbook.color}
  />

  <Toggle text="Encrypt export" bind:value={encrypted} />

  {#if encrypted}
    <Input
      type="password"
      label="Password"
      placeholder="Type here..."
      autocomplete="new-password"
      bind:value={encryptPassword}
    />
  {/if}
</ModalContent>
