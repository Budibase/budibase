<script>
  import {
    ModalContent,
    Input,
    notifications,
    Layout,
    keepOpen,
  } from "@budibase/bbui"
  import { createValidationStore } from "@/helpers/validation/yup"
  import { writable, get } from "svelte/store"
  import * as appValidation from "@/helpers/validation/yup/app"
  import { appsStore, auth } from "@/stores/portal"
  import { onMount } from "svelte"
  import { API } from "@/api"
  import { sdk } from "@budibase/shared-core"

  export let appId
  export let appName
  export let onDuplicateSuccess = () => {}

  const validation = createValidationStore()
  const values = writable({ name: appName + " copy", url: null })
  const appPrefix = "/app"

  let defaultAppName = appName + " copy"
  let duplicating = false

  $: {
    const { url } = $values

    validation.check({
      ...$values,
      url: url?.[0] === "/" ? url.substring(1, url.length) : url,
    })
  }

  const resolveAppName = name => {
    return name ? name.trim() : null
  }

  const resolveAppUrl = name => {
    let parsedName
    const resolvedName = resolveAppName(name)
    parsedName = resolvedName ? resolvedName.toLowerCase() : ""
    const parsedUrl = parsedName ? parsedName.replace(/\s+/g, "-") : ""
    return encodeURI(parsedUrl)
  }

  const nameToUrl = appName => {
    let resolvedUrl = resolveAppUrl(appName)
    tidyUrl(resolvedUrl)
  }

  const tidyUrl = url => {
    if (url && !url.startsWith("/")) {
      url = `/${url}`
    }
    $values.url = url === "" ? null : url
  }

  const duplicateApp = async () => {
    duplicating = true

    let data = new FormData()
    data.append("name", $values.name.trim())
    if ($values.url) {
      data.append("url", $values.url.trim())
    }

    try {
      const app = await API.duplicateApp(appId, data)
      appsStore.load()
      if (!sdk.users.isBuilder($auth.user, app?.duplicateAppId)) {
        // Refresh for access to created applications
        await auth.getSelf()
      }
      onDuplicateSuccess()
      notifications.success("App duplicated successfully")
    } catch (err) {
      notifications.error("Error duplicating app")
      duplicating = false
    }
  }

  const setupValidation = async () => {
    const applications = get(appsStore).apps
    appValidation.name(validation, { apps: applications })
    appValidation.url(validation, { apps: applications })

    const { url } = $values
    validation.check({
      ...$values,
      url: url?.[0] === "/" ? url.substring(1, url.length) : url,
    })
  }

  $: appUrl = `${window.location.origin}${
    $values.url
      ? `${appPrefix}${$values.url}`
      : `${appPrefix}${resolveAppUrl($values.name)}`
  }`

  onMount(async () => {
    nameToUrl($values.name)
    await setupValidation()
  })
</script>

<ModalContent
  title={"Duplicate App"}
  onConfirm={async () => {
    validation.check({
      ...$values,
    })
    if ($validation.valid) {
      await duplicateApp()
    } else {
      return keepOpen
    }
  }}
>
  <Layout gap="S" noPadding>
    <Input
      autofocus={true}
      bind:value={$values.name}
      disabled={duplicating}
      error={$validation.touched.name && $validation.errors.name}
      on:blur={() => ($validation.touched.name = true)}
      on:change={nameToUrl($values.name)}
      label="Name"
      placeholder={defaultAppName}
    />
    <span>
      <Input
        bind:value={$values.url}
        disabled={duplicating}
        error={$validation.touched.url && $validation.errors.url}
        on:blur={() => ($validation.touched.url = true)}
        on:change={tidyUrl($values.url)}
        label="URL"
        placeholder={$values.url
          ? $values.url
          : `/${resolveAppUrl($values.name)}`}
      />
      {#if $values.url && $values.url !== "" && !$validation.errors.url}
        <div class="app-server" title={appUrl}>
          {appUrl}
        </div>
      {/if}
    </span>
  </Layout>
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
