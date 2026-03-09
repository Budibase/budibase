<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import {
    Body,
    Dropzone,
    Input,
    Layout,
    ModalContent,
    Toggle,
  } from "@budibase/bbui"
  import type { UIFile } from "@budibase/types"

  const dispatch = createEventDispatcher<{
    confirm: {
      file: File
      encryptPassword?: string
    }
  }>()

  let encrypted = false
  let encryptPassword = ""
  let file: File | undefined = undefined

  $: disabled = !file || (encrypted && !encryptPassword.trim())

  const handleFileChange = (event: CustomEvent<Array<UIFile | File>>) => {
    const nextFile = event.detail?.[0]
    file = nextFile instanceof File ? nextFile : undefined
    encrypted = !!file?.name?.endsWith(".enc.tar.gz")
  }
</script>

<ModalContent
  title="Import playbook"
  confirmText="Import"
  size="M"
  bind:disabled
  onConfirm={() =>
    file &&
    dispatch("confirm", {
      file,
      encryptPassword: encrypted ? encryptPassword.trim() : undefined,
    })}
>
  <Body size="S">
    Importing a Playbook adds a new Playbook and its supported resources to this
    workspace without replacing existing apps or automations.
  </Body>

  <Layout noPadding gap="S">
    <Dropzone
      gallery={false}
      label="Playbook export"
      on:change={handleFileChange}
    />
    <Toggle text="Encrypted" bind:value={encrypted} />
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
