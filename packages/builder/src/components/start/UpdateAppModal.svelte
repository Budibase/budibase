<script>
  import { writable, get as svelteGet } from "svelte/store"
  import { notifications, Input, ModalContent, Body } from "@budibase/bbui"
  import { hostingStore } from "builderStore"
  import { apps } from "stores/portal"
  import { onMount } from "svelte"
  import { createValidationStore } from "helpers/validation/yup"
  import * as appValidation from "helpers/validation/yup/app"

  export let app

  const values = writable({ name: "", url: null })
  const validation = createValidationStore()
  $: validation.check($values)

  onMount(async () => {
    $values.name = app.name
    $values.url = app.url
    setupValidation()
  })

  const setupValidation = async () => {
    await hostingStore.actions.fetchDeployedApps()
    const apps = svelteGet(hostingStore).deployedApps
    appValidation.name(validation, { apps, currentApp: app })
    appValidation.url(validation, { apps, currentApp: app })
    // init validation
    validation.check($values)
  }

  async function updateApp() {
    try {
      // Update App
      await apps.update(app.instance._id, { name: $values.name.trim() })
    } catch (error) {
      console.error(error)
      notifications.error(error)
    }
  }

  // auto add slash to url
  $: {
    if ($values.url && !$values.url.startsWith("/")) {
      $values.url = `/${$values.url}`
    }
  }
</script>

<ModalContent
  title={"Edit app"}
  confirmText={"Save"}
  onConfirm={updateApp}
  disabled={!$validation.valid}
>
  <Body size="S">Update the name of your app.</Body>
  <Input
    bind:value={$values.name}
    error={$validation.touched.name && $validation.errors.name}
    on:blur={() => ($validation.touched.name = true)}
    label="Name"
  />
  <Input
    bind:value={$values.url}
    error={$validation.touched.url && $validation.errors.url}
    on:blur={() => ($validation.touched.url = true)}
    label="URL"
    placeholder={$values.name
      ? "/" + encodeURIComponent($values.name).toLowerCase()
      : "/"}
  />
</ModalContent>
