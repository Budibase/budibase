<script lang="ts">
  import {
    Body,
    InlineAlert,
    Input,
    keepOpen,
    ModalContent,
    notifications,
    Toggle,
  } from "@budibase/bbui"
  import { downloadFile } from "@budibase/frontend-core"
  import { createValidationStore } from "@budibase/frontend-core/src/utils/validation/yup"
  import { sdk } from "@budibase/shared-core"

  export let appId: string
  export let published
  let includeInternalTablesRows = true
  let encrypt = true

  let password: string | null = null
  const validation = createValidationStore()
  validation.addValidatorType("password", "password", true, { minLength: 12 })
  $: validation.observe("password", password)

  const Step = { CONFIG: "config", SET_PASSWORD: "set_password" }
  let currentStep = Step.CONFIG

  $: exportButtonText = published ? "Export published" : "Export latest"
  $: stepConfig = {
    [Step.CONFIG]: {
      title: published
        ? `Export published workspace`
        : `Export latest workspace`,
      confirmText: encrypt ? "Continue" : exportButtonText,
      onConfirm: async () => {
        if (!encrypt) {
          await exportWorkspace()
        } else {
          currentStep = Step.SET_PASSWORD
          return keepOpen
        }
      },
      isValid: true,
    },
    [Step.SET_PASSWORD]: {
      title: "Add password to encrypt your export",
      confirmText: exportButtonText,
      onConfirm: async () => {
        await validation.check({ password })
        if (!$validation.valid) {
          return keepOpen
        }
        await exportWorkspace()
      },
      isValid: $validation.valid,
    },
  }

  const exportWorkspace = async () => {
    const id = published
      ? sdk.workspaces.getProdWorkspaceID(appId)
      : sdk.workspaces.getDevWorkspaceID(appId)
    const url = `/api/backups/export?appId=${id}`

    try {
      const downloaded = await downloadFile(url, {
        excludeRows: !includeInternalTablesRows,
        encryptPassword: password,
      })
      if (!downloaded) {
        notifications.error(`Error exporting the workspace.`)
      }
    } catch (error: any) {
      notifications.error(
        error.message || `Error downloading the exported workspace`
      )
    }
  }
</script>

<ModalContent
  title={stepConfig[currentStep].title}
  confirmText={stepConfig[currentStep].confirmText}
  onConfirm={stepConfig[currentStep].onConfirm}
  disabled={!stepConfig[currentStep].isValid}
>
  {#if currentStep === Step.CONFIG}
    <Body>
      <Toggle
        text="Include data and files"
        bind:value={includeInternalTablesRows}
      />
      <Toggle text="Encrypt export" bind:value={encrypt} />
    </Body>
    {#if encrypt && includeInternalTablesRows}
      <InlineAlert
        header="Attachments are not encrypted. Agent knowledge files are encrypted."
      />
    {:else if !encrypt}
      <InlineAlert
        header="This export is not encrypted and may contain credentials, secret keys, and other sensitive data."
      />
    {/if}
  {/if}
  {#if currentStep === Step.SET_PASSWORD}
    <Input
      type="password"
      label="Password"
      autocomplete="new-password"
      placeholder="Type here..."
      bind:value={password}
      error={$validation.errors.password}
    />
  {/if}
</ModalContent>
