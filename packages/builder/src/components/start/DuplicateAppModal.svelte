<script lang="ts">
  import { API } from "@/api"
  import { appsStore, auth } from "@/stores/portal"
  import {
    Input,
    Layout,
    ModalContent,
    keepOpen,
    notifications,
  } from "@budibase/bbui"
  import { createValidationStore } from "@budibase/frontend-core/src/utils/validation/yup"
  import * as appValidation from "@budibase/frontend-core/src/utils/validation/yup/app"
  import { sdk } from "@budibase/shared-core"
  import type { CreateWorkspaceRequest } from "@budibase/types"
  import { onMount } from "svelte"
  import { get, writable } from "svelte/store"

  export let appId: string
  export let appName: string
  export let onDuplicateSuccess = () => {}

  const validation = createValidationStore()
  const values = writable<{ name: string; url: string | null }>({
    name: appName + " copy",
    url: null,
  })
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

  const resolveAppName = (name: string) => {
    return name ? name.trim() : null
  }

  const resolveAppUrl = (name: string) => {
    let parsedName
    const resolvedName = resolveAppName(name)
    parsedName = resolvedName ? resolvedName.toLowerCase() : ""
    const parsedUrl = parsedName ? parsedName.replace(/\s+/g, "-") : ""
    return encodeURI(parsedUrl)
  }

  const nameToUrl = (appName: string) => {
    let resolvedUrl = resolveAppUrl(appName)
    tidyUrl(resolvedUrl)
  }

  const tidyUrl = (url: string | null) => {
    if (url && !url.startsWith("/")) {
      url = `/${url}`
    }
    $values.url = url === "" ? null : url
  }

  const duplicateApp = async () => {
    duplicating = true

    const data: CreateWorkspaceRequest = {
      name: $values.name.trim(),
    }

    if ($values.url) {
      data.url = $values.url.trim()
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
      on:change={() => nameToUrl($values.name)}
      label="Name"
      placeholder={defaultAppName}
    />
    <span>
      <Input
        bind:value={$values.url}
        disabled={duplicating}
        error={$validation.touched.url && $validation.errors.url}
        on:blur={() => ($validation.touched.url = true)}
        on:change={() => tidyUrl($values.url)}
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
