<script lang="ts">
  import { Body, Input, ModalContent, Select, Toggle } from "@budibase/bbui"
  import type { PlaybookResponse } from "@budibase/types"

  export let playbooks: PlaybookResponse[] = []
  export let selectedPlaybookId = ""

  interface ConfirmPayload {
    id: string
    encryptPassword?: string
  }

  export let onConfirm: (_payload: ConfirmPayload) => unknown = () => {}

  let playbookId = ""
  let encrypted = false
  let encryptPassword = ""
  let disabled = false
  let initialised = false

  $: if (!initialised && playbooks.length) {
    const selectedPlaybook = playbooks.find(
      playbook => playbook._id === selectedPlaybookId
    )

    if (selectedPlaybook) {
      playbookId = selectedPlaybook._id
    } else if (playbooks.length === 1) {
      playbookId = playbooks[0]._id
    }

    initialised = true
  }

  $: if (!encrypted && encryptPassword) {
    encryptPassword = ""
  }

  $: disabled = !playbookId || (encrypted && !encryptPassword.trim())
</script>

<ModalContent
  title="Export playbook"
  confirmText="Export"
  size="M"
  bind:disabled
  onConfirm={() =>
    onConfirm({
      id: playbookId,
      encryptPassword: encrypted ? encryptPassword.trim() : undefined,
    })}
>
  <Body size="S">
    Export a portable Playbook package for use in another workspace. Rows and
    attachments are not included yet.
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
