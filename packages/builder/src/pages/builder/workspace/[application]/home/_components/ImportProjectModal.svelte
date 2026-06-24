<svelte:options runes={true} />

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

  interface Props {
    onConfirm?: (_payload: ConfirmPayload) => unknown
  }

  let { onConfirm = () => {} }: Props = $props()

  let manualEncrypted = $state(false)
  let encryptPassword = $state("")
  let file = $state<File | undefined>(undefined)

  const encrypted = $derived(
    manualEncrypted || !!file?.name?.endsWith(".enc.tar.gz")
  )
  let disabled = $derived(!file || (encrypted && !encryptPassword.trim()))

  $effect(() => {
    if (!encrypted && encryptPassword) {
      encryptPassword = ""
    }
  })

  const handleFileChange = (event: CustomEvent<Array<UIFile | File>>) => {
    const nextFile = event.detail?.[0]
    file = nextFile instanceof File ? nextFile : undefined
    manualEncrypted = false
  }
</script>

<ModalContent
  title="Import project"
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
    Importing a Project adds a new Project and its supported resource
    definitions to this workspace without replacing existing apps or
    automations.
  </Body>

  <Layout noPadding gap="S">
    <Dropzone
      gallery={false}
      label="Project export"
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
