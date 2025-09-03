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
          await exportApp()
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
        await exportApp()
      },
      isValid: $validation.valid,
    },
  }

  const exportApp = async () => {
    const id = published
      ? sdk.applications.getProdAppID(appId)
      : sdk.applications.getDevAppID(appId)
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
        text="Export rows from internal tables"
        bind:value={includeInternalTablesRows}
      />
      <Toggle text="Encrypt my export" bind:value={encrypt} />
    </Body>
    <InlineAlert
      header={encrypt
        ? "Please note Budibase does not encrypt attachments during the export process to ensure efficient export of large attachments."
        : "Do not share your Budibase exports publicly as they may contain sensitive information such as database credentials or secret keys."}
    />
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
