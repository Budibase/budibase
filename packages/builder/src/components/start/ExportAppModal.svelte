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
  import { createValidationStore } from "helpers/validation/yup"

  export let app
  export let published
  let includeInternalTablesRows = true
  let encypt = true

  let password = null
  const validation = createValidationStore()
  validation.addValidatorType("password", "password", true, { minLength: 8 })
  $: validation.observe("password", password)

  const Step = { CONFIG: "config", SET_PASSWORD: "set_password" }
  let currentStep = Step.CONFIG

  $: exportButtonText = published ? "Export published" : "Export latest"
  $: stepConfig = {
    [Step.CONFIG]: {
      title: published ? "Export published app" : "Export latest app",
      confirmText: encypt ? "Continue" : exportButtonText,
      onConfirm: () => {
        if (!encypt) {
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
        exportApp(password)
      },
      isValid: $validation.valid,
    },
  }

  const exportApp = async () => {
    const id = published ? app.prodId : app.devId
    const url = `/api/backups/export?appId=${id}`
    await downloadFile(url, {
      excludeRows: !includeInternalTablesRows,
      encryptPassword: password,
    })
  }

  async function downloadFile(url, body) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const contentDisposition = response.headers.get("Content-Disposition")

        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          contentDisposition
        )

        const filename = matches[1].replace(/['"]/g, "")

        const url = URL.createObjectURL(await response.blob())

        const link = document.createElement("a")
        link.href = url
        link.download = filename
        link.click()

        URL.revokeObjectURL(url)
      } else {
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
      <Toggle text="Encrypt my export" bind:value={encypt} />
    </Body>
    {#if !encypt}
      <InlineAlert
        header="Do not share your budibase application exports publicly as they may contain sensitive information such as database credentials or secret keys."
      />
    {/if}
  {/if}
  {#if currentStep === Step.SET_PASSWORD}
    <Input
      type="password"
      label="Password"
      placeholder="Type here..."
      bind:value={password}
      error={$validation.errors.password}
    />
  {/if}
</ModalContent>
