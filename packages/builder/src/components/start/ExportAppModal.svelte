<script>
  import {
    ModalContent,
    Toggle,
    Body,
    InlineAlert,
    Input,
  } from "@budibase/bbui"

  export let app
  export let published
  let includeInternalTablesRows = true
  let encypt = true
  let password
  let passwordError

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
          return false
        }
      },
    },
    [Step.SET_PASSWORD]: {
      title: "Add password to encrypt your export",
      confirmText: exportButtonText,
      onConfirm: () => {
        if (!password) {
          passwordError = "Password is required"
          return false
        }
        exportApp()
      },
    },
  }

  const exportApp = () => {
    const id = published ? app.prodId : app.devId
    const appName = encodeURIComponent(app.name)
    window.location = `/api/backups/export?appId=${id}&appname=${appName}&excludeRows=${!includeInternalTablesRows}`
  }
</script>

<ModalContent
  title={stepConfig[currentStep].title}
  confirmText={stepConfig[currentStep].confirmText}
  onConfirm={stepConfig[currentStep].onConfirm}
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
      label="Password"
      placeholder="Type here..."
      bind:value={password}
      error={passwordError}
    />
  {/if}
</ModalContent>
