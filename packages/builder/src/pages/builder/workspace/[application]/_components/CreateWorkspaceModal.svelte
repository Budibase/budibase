<script lang="ts">
  import { writable, get } from "svelte/store"
  import {
    notifications,
    keepOpen,
    Input,
    ModalContent,
    Dropzone,
    Button,
  } from "@budibase/bbui"
  import { initialise, builderStore, reset } from "@/stores/builder"
  import { API } from "@/api"
  import { appsStore, auth } from "@/stores/portal"
  import { onMount, createEventDispatcher } from "svelte"
  import { goto as gotoStore } from "@roxi/routify"
  import { createValidationStore } from "@budibase/frontend-core/src/utils/validation/yup"
  import * as workspaceValidation from "@budibase/frontend-core/src/utils/validation/yup/app"
  import { lowercase } from "@/helpers"
  import { sdk } from "@budibase/shared-core"
  import type { AppTemplate } from "@/types"

  $: goto = $gotoStore

  export let redirectOnCreate = true

  const dispatch = createEventDispatcher()
  const values = writable<{
    name: string
    url: string | null
    file?: File
    encryptionPassword?: string
  }>({
    name: "",
    url: null,
  })
  const validation = createValidationStore()
  const encryptionValidation = createValidationStore()
  const isEncryptedRegex = /^.*\.enc.*\.tar\.gz$/gm

  let creating = false
  let defaultAppName: string
  let template: AppTemplate | null = null

  $: {
    const { url } = $values

    validation.check({
      ...$values,
      url: url?.[0] === "/" ? url.substring(1, url.length) : url,
    })
    encryptionValidation.check({ ...$values })
  }

  // filename should be separated to avoid updates everytime any other form element changes
  $: filename = $values.file?.name
  $: encryptedFile = !!filename && isEncryptedRegex.test(filename)

  onMount(async () => {
    if ($auth.user?.firstName) {
      const lastChar = $auth.user?.firstName
        ? $auth.user?.firstName[$auth.user?.firstName.length - 1]
        : null
      defaultAppName =
        lastChar && lastChar.toLowerCase() == "s"
          ? `${$auth.user.firstName} workspace`
          : `${$auth.user.firstName}s workspace`
    } else {
      defaultAppName = `My workspace`
    }

    $values.name = resolveAppName(template, defaultAppName)
    nameToUrl($values.name)
    await setupValidation()
  })

  $: workspacePrefix = `/workspace`

  $: appUrl = `${window.location.origin}${
    $values.url
      ? `${workspacePrefix}${$values.url}`
      : `${workspacePrefix}${resolveAppUrl(template, $values.name)}`
  }`

  const resolveAppUrl = (template: AppTemplate | null, name: string) => {
    let parsedName
    const resolvedName = resolveAppName(template, name)
    parsedName = resolvedName ? resolvedName.toLowerCase() : ""
    const parsedUrl = parsedName ? parsedName.replace(/\s+/g, "-") : ""
    return encodeURI(parsedUrl)
  }

  const resolveAppName = (template: AppTemplate | null, name: string) => {
    if (template && !template.fromFile) {
      return template.name
    }
    return name ? name.trim() : ""
  }

  const tidyUrl = (url: string | null) => {
    if (url && !url.startsWith("/")) {
      url = `/${url}`
    }
    $values.url = url === "" ? null : url
  }

  const nameToUrl = (appName: string) => {
    let resolvedUrl = resolveAppUrl(template, appName)
    tidyUrl(resolvedUrl)
  }

  const setupValidation = async () => {
    const applications = get(appsStore).apps
    workspaceValidation.name(validation, { workspaces: applications })
    workspaceValidation.url(validation, { workspaces: applications })
    workspaceValidation.file(validation, { template })

    encryptionValidation.addValidatorType("encryptionPassword", "text", true)

    // init validation
    const { url } = $values
    validation.check({
      ...$values,
      url: url?.[0] === "/" ? url.substring(1, url.length) : url,
    })
  }
  async function createNewApp() {
    creating = true

    try {
      // Create form data to create app
      let data = new FormData()
      data.append("name", $values.name.trim())
      if ($values.url) {
        data.append("url", $values.url.trim())
      }

      if (template?.fromFile) {
        data.append("useTemplate", "true")
        data.append("fileToImport", $values.file!)
        if ($values.encryptionPassword?.trim()) {
          data.append("encryptionPassword", $values.encryptionPassword.trim())
        }
      }

      // Create App
      const createdApp = await API.createApp(data)

      if (!redirectOnCreate) {
        dispatch("created", createdApp)
        return
      }

      // Clear out the app context in the bulder
      reset()

      // Select Correct Application/DB in prep for creating user
      const pkg = await API.fetchAppPackage(createdApp.instance._id)

      // Set the builder state to know that a new app has been created
      builderStore.appCreated(true)

      await initialise(pkg)

      if (!sdk.users.isBuilder($auth.user, createdApp?.appId)) {
        // Refresh for access to created applications
        await auth.getSelf()
      }
      goto(`/builder/workspace/${createdApp.instance._id}`)
    } catch (error) {
      creating = false
      builderStore.appCreated(false)
      throw error
    }
  }

  const Step = { CONFIG: "config", SET_PASSWORD: "set_password" }
  let currentStep = Step.CONFIG

  // Check if create button should be enabled
  $: isCreateValid = template?.fromFile
    ? $validation.valid && !!$values.file
    : $validation.valid

  $: stepConfig = {
    [Step.CONFIG]: {
      title: `Create your workspace`,
      confirmText: `Create workspace`,
      onConfirm: async () => {
        if (encryptedFile) {
          currentStep = Step.SET_PASSWORD
          return keepOpen
        } else {
          try {
            await createNewApp()
          } catch (error: any) {
            notifications.error(`Error creating workspace - ${error.message}`)
          }
        }
      },
      isValid: isCreateValid,
    },
    [Step.SET_PASSWORD]: {
      title: "Provide the export password",
      confirmText: `Import workspace`,
      onConfirm: async () => {
        try {
          await createNewApp()
        } catch (e: any) {
          let message = `Error creating workspace`
          if (e.message) {
            message += `: ${lowercase(e.message)}`
          }
          notifications.error(message)
          return keepOpen
        }
      },
      isValid: $encryptionValidation.valid,
    },
  }

  function onDropFile(e: CustomEvent<any[]>) {
    $values.file = e.detail?.[0]
    $validation.touched.file = true
  }
</script>

<ModalContent
  size="M"
  title={stepConfig[currentStep].title}
  confirmText={stepConfig[currentStep].confirmText}
  onConfirm={stepConfig[currentStep].onConfirm}
  disabled={!stepConfig[currentStep].isValid}
  showCancelButton={false}
>
  {#if currentStep === Step.CONFIG}
    <div class="modal-content">
      <Input
        autofocus={true}
        bind:value={$values.name}
        disabled={creating}
        error={$validation.touched.name && $validation.errors.name}
        on:blur={() => ($validation.touched.name = true)}
        on:change={() => nameToUrl($values.name)}
        label="Name"
        placeholder={defaultAppName}
      />

      {#if $values.url && $values.url !== "" && !$validation.errors.url}
        <div class="app-server" title={appUrl}>
          {appUrl}
        </div>
      {/if}
    </div>
    {#if template?.fromFile}
      <Dropzone
        error={$validation.touched.file && $validation.errors.file}
        gallery={false}
        label="Select workspace"
        value={$values.file ? [$values.file] : []}
        on:change={onDropFile}
      />
    {/if}
  {/if}
  {#if currentStep === Step.SET_PASSWORD}
    <Input
      autofocus={true}
      label="Imported file password"
      type="password"
      bind:value={$values.encryptionPassword}
      disabled={creating}
      on:blur={() => ($encryptionValidation.touched.encryptionPassword = true)}
      error={$encryptionValidation.touched.encryptionPassword &&
        $encryptionValidation.errors.encryptionPassword}
    />
  {/if}

  <div slot="footer">
    <Button
      secondary
      quiet
      disabled={creating}
      on:click={() => {
        if (template?.fromFile) {
          // Turning off import - clear file selection
          template = null
          $values.file = undefined
          $validation.touched.file = false
        } else {
          // Turning on import
          template = { fromFile: true }
        }
      }}
    >
      {template?.fromFile ? "Don't import workspace" : "Import workspace"}
    </Button>
  </div>
</ModalContent>

<style>
  .app-server {
    color: var(--spectrum-global-color-gray-600);
    margin-top: 10px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .modal-content {
    overflow: hidden;
  }
</style>
