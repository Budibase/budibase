<script>
  import {
    ModalContent,
    keepOpen,
    Toggle,
    Body,
    InlineAlert,
    Input,
    notifications,
  } from "@budibase/bbui"
  import { downloadFile } from "@budibase/frontend-core"
  import { createValidationStore } from "@/helpers/validation/yup"

  export let app
  export let published
  let includeInternalTablesRows = true
  let encrypt = true

  let password = null
  const validation = createValidationStore()
  validation.addValidatorType("password", "password", true, { minLength: 12 })
  $: validation.observe("password", password)

  const Step = { CONFIG: "config", SET_PASSWORD: "set_password" }
  let currentStep = Step.CONFIG

  $: exportButtonText = published ? "Export published" : "Export latest"
  $: stepConfig = {
    [Step.CONFIG]: {
      title: published ? "Export published app" : "Export latest app",
      confirmText: encrypt ? "Continue" : exportButtonText,
      onConfirm: () => {
        if (!encrypt) {
          exportApp()
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
        await exportApp(password)
      },
      isValid: $validation.valid,
    },
  }

  const exportApp = async () => {
    const id = published ? app.prodId : app.devId
    const url = `/api/backups/export?appId=${id}`

    try {
      const downloaded = await downloadFile(url, {
        excludeRows: !includeInternalTablesRows,
        encryptPassword: password,
      })
      if (!downloaded) {
        notifications.error("Error exporting the app.")
      }
    } catch (error) {
      notifications.error(error.message || "Error downloading the exported app")
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
        : "Do not share your Budibase application exports publicly as they may contain sensitive information such as database credentials or secret keys."}
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
