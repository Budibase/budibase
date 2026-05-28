<script lang="ts">
  import {
    Body,
    Dropzone,
    Input,
    Layout,
    ModalContent,
    Toggle,
  } from "@budibase/bbui"
  import type { UIFile } from "@budibase/types"

  interface ConfirmPayload {
    file: File
    encryptPassword?: string
  }

  export let onConfirm: (_payload: ConfirmPayload) => unknown = () => {}

  let encrypted = false
  let manualEncrypted = false
  let encryptPassword = ""
  let file: File | undefined = undefined
  let disabled = false

  $: encrypted = manualEncrypted || !!file?.name?.endsWith(".enc.tar.gz")
  $: disabled = !file || (encrypted && !encryptPassword.trim())

  $: if (!encrypted && encryptPassword) {
    encryptPassword = ""
  }

  const handleFileChange = (event: CustomEvent<Array<UIFile | File>>) => {
    const nextFile = event.detail?.[0]
    file = nextFile instanceof File ? nextFile : undefined
    manualEncrypted = false
  }
</script>

<ModalContent
  title="Import playbook"
  confirmText="Import"
  size="M"
  bind:disabled
  onConfirm={() =>
    file &&
    onConfirm({
      file,
      encryptPassword: encrypted ? encryptPassword.trim() : undefined,
    })}
>
  <Body size="S">
    Importing a Playbook adds a new Playbook and its supported resource
    definitions to this workspace without replacing existing apps or
    automations.
  </Body>

  <Layout noPadding gap="S">
    <Dropzone
      gallery={false}
      label="Playbook export"
      on:change={handleFileChange}
    />
    <Toggle
      text="Encrypted"
      bind:value={manualEncrypted}
      disabled={!!file?.name?.endsWith(".enc.tar.gz")}
    />
    {#if encrypted}
      <Input
        type="password"
        label="Password"
        placeholder="Type here..."
        autocomplete="new-password"
        bind:value={encryptPassword}
      />
    {/if}
  </Layout>
</ModalContent>
