<script>
  import { writable, get as svelteGet } from "svelte/store"
  import { notifications, Input, ModalContent, Dropzone } from "@budibase/bbui"
  import { store, automationStore } from "builderStore"
  import { API } from "api"
  import { apps, admin, auth } from "stores/portal"
  import analytics, { Events } from "analytics"
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { createValidationStore } from "helpers/validation/yup"
  import * as appValidation from "helpers/validation/yup/app"
  import TemplateCard from "components/common/TemplateCard.svelte"
  import createFromScratchScreen from "builderStore/store/screenTemplates/createFromScratchScreen"
  import { Roles } from "constants/backend"

  export let template

  let creating = false
  let defaultAppName

  const values = writable({ name: "", url: null })
  const validation = createValidationStore()
  $: validation.check($values)

  onMount(async () => {
    const lastChar = $auth.user?.firstName
      ? $auth.user?.firstName[$auth.user?.firstName.length - 1]
      : null

    defaultAppName =
      lastChar && lastChar.toLowerCase() == "s"
        ? `${$auth.user?.firstName} app`
        : `${$auth.user.firstName}s app`

    $values.name = resolveAppName(
      template,
      !$auth.user?.firstName ? "My app" : defaultAppName
    )
    nameToUrl($values.name)
    await setupValidation()
  })

  const appPrefix = "/app"

  $: appUrl = `${window.location.origin}${
    $values.url
      ? `${appPrefix}${$values.url}`
      : `${appPrefix}${resolveAppUrl(template, $values.name)}`
  }`

  const resolveAppUrl = (template, name) => {
    let parsedName
    const resolvedName = resolveAppName(template, name)
    parsedName = resolvedName ? resolvedName.toLowerCase() : ""
    const parsedUrl = parsedName ? parsedName.replace(/\s+/g, "-") : ""
    return encodeURI(parsedUrl)
  }

  const resolveAppName = (template, name) => {
    if (template && !template.fromFile) {
      return template.name
    }
    return name ? name.trim() : null
  }

  const tidyUrl = url => {
    if (url && !url.startsWith("/")) {
      url = `/${url}`
    }
    $values.url = url === "" ? null : url
  }

  const nameToUrl = appName => {
    let resolvedUrl = resolveAppUrl(template, appName)
    tidyUrl(resolvedUrl)
  }

  const setupValidation = async () => {
    const applications = svelteGet(apps)
    appValidation.name(validation, { apps: applications })
    appValidation.url(validation, { apps: applications })
    appValidation.file(validation, { template })
    // init validation
    validation.check($values)
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
      data.append("useTemplate", template != null)
      if (template) {
        data.append("templateName", template.name)
        data.append("templateKey", template.key)
        data.append("templateFile", $values.file)
      }

      // Create App
      const createdApp = await API.createApp(data)
      analytics.captureEvent(Events.APP.CREATED, {
        name: $values.name,
        appId: createdApp.instance._id,
        templateToUse: template,
      })

      // Select Correct Application/DB in prep for creating user
      const pkg = await API.fetchAppPackage(createdApp.instance._id)
      await store.actions.initialise(pkg)
      await automationStore.actions.fetch()
      // Update checklist - in case first app
      await admin.init()

      // Create user
      await API.updateOwnMetadata({ roleId: $values.roleId })
      await auth.setInitInfo({})

      // Create a default home screen if no template was selected
      if (template == null) {
        let defaultScreenTemplate = createFromScratchScreen.create()
        defaultScreenTemplate.routing.route = "/home"
        defaultScreenTemplate.routing.roldId = Roles.BASIC
        try {
          await store.actions.screens.save(defaultScreenTemplate)
        } catch (err) {
          console.error("Could not create a default application screen", err)
          notifications.warning(
            "Encountered an issue creating the default screen."
          )
        }
      }

      $goto(`/builder/app/${createdApp.instance._id}`)
    } catch (error) {
      creating = false
      console.error(error)
      notifications.error("Error creating app")
    }
  }
</script>

<ModalContent
  title={"Create your app"}
  confirmText={template?.fromFile ? "Import app" : "Create app"}
  onConfirm={createNewApp}
  disabled={!$validation.valid}
>
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
      value={[$values.file]}
      on:change={e => {
        $values.file = e.detail?.[0]
        $validation.touched.file = true
      }}
    />
  {/if}
  <Input
    autofocus={true}
    bind:value={$values.name}
    disabled={creating}
    error={$validation.touched.name && $validation.errors.name}
    on:blur={() => ($validation.touched.name = true)}
    on:change={nameToUrl($values.name)}
    label="Name"
    placeholder={defaultAppName}
  />
  <span>
    <Input
      bind:value={$values.url}
      disabled={creating}
      error={$validation.touched.url && $validation.errors.url}
      on:blur={() => ($validation.touched.url = true)}
      on:change={tidyUrl($values.url)}
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
