<script lang="ts">
  import { writable, get as svelteGet } from "svelte/store"
  import {
    notifications,
    keepOpen,
    Input,
    ModalContent,
    Dropzone,
  } from "@budibase/bbui"
  import { initialise } from "@/stores/builder"
  import { API } from "@/api"
  import { appsStore, admin, auth, appCreationStore } from "@/stores/portal"
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { createValidationStore } from "@budibase/frontend-core/src/utils/validation/yup"
  import * as appValidation from "@budibase/frontend-core/src/utils/validation/yup/app"
  import TemplateCard from "@/components/common/TemplateCard.svelte"
  import { lowercase } from "@/helpers"
  import { sdk } from "@budibase/shared-core"
  import type { AppTemplate } from "@/types"

  let creating = false
  let defaultAppName: string

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

  $: template = $appCreationStore.template

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

  $: appPrefix = `/workspace`

  $: appUrl = `${window.location.origin}${
    $values.url
      ? `${appPrefix}${$values.url}`
      : `${appPrefix}${resolveAppUrl(template, $values.name)}`
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
    const applications = svelteGet(appsStore).apps
    appValidation.name(validation, { apps: applications })
    appValidation.url(validation, { apps: applications })
    appValidation.file(validation, { template })

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
      } else if (template && !template.fromFile) {
        data.append("useTemplate", "true")
        data.append("templateName", template.name)
        data.append("templateKey", template.key)
      }

      data.append("isOnboarding", "false")

      // Create App
      const createdApp = await API.createApp(data)

      // Select Correct Application/DB in prep for creating user
      const pkg = await API.fetchAppPackage(createdApp.instance._id)

      await initialise(pkg)

      // Update checklist - in case first app
      await admin.init()

      // Create user
      await auth.setInitInfo({})

      if (!sdk.users.isBuilder($auth.user, createdApp?.appId)) {
        // Refresh for access to created applications
        await auth.getSelf()
      }

      $goto(`/builder/workspace/${createdApp.instance._id}`)
    } catch (error) {
      creating = false
      throw error
    }
  }

  const Step = { CONFIG: "config", SET_PASSWORD: "set_password" }
  let currentStep = Step.CONFIG

  $: stepConfig = {
    [Step.CONFIG]: {
      title: `Create your workspace`,
      confirmText: template?.fromFile ? `Import workspace` : `Create workspace`,
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
      isValid: $validation.valid,
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
  title={stepConfig[currentStep].title}
  confirmText={stepConfig[currentStep].confirmText}
  onConfirm={stepConfig[currentStep].onConfirm}
  disabled={!stepConfig[currentStep].isValid}
>
  {#if currentStep === Step.CONFIG}
    {#if template && !template?.fromFile}
      <TemplateCard
        name={template.name}
        imageSrc={template.image}
        backgroundColour={template.background}
        overlayEnabled={false}
        icon={template.icon}
      />
    {/if}
    {#if template?.fromFile}
      <Dropzone
        error={$validation.touched.file && $validation.errors.file}
        gallery={false}
        label="File to import"
        value={$values.file ? [$values.file] : []}
        on:change={onDropFile}
      />
    {/if}
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
    <span>
      <Input
        bind:value={$values.url}
        disabled={creating}
        error={$validation.touched.url && $validation.errors.url}
        on:blur={() => ($validation.touched.url = true)}
        on:change={() => tidyUrl($values.url)}
        label="URL"
        placeholder={$values.url
          ? $values.url
          : `/${resolveAppUrl(template, $values.name)}`}
      />
      {#if $values.url && $values.url !== "" && !$validation.errors.url}
        <div class="app-server" title={appUrl}>
          {appUrl}
        </div>
      {/if}
    </span>
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
</ModalContent>

<style>
  .app-server {
    color: var(--spectrum-global-color-gray-600);
    margin-top: 10px;
    width: 320px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
