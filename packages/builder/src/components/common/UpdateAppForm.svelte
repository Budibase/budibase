<script lang="ts">
  import {
    Button,
    Label,
    Icon,
    Input,
    notifications,
    Body,
  } from "@budibase/bbui"
  import { AppStatus } from "@/constants"
  import { appStore, initialise } from "@/stores/builder"
  import { appsStore } from "@/stores/portal"
  import { API } from "@/api"
  import { writable } from "svelte/store"
  import { createValidationStore } from "@budibase/frontend-core/src/utils/validation/yup"
  import * as appValidation from "@budibase/frontend-core/src/utils/validation/yup/app"
  import EditableIcon from "@/components/common/EditableIcon.svelte"
  import { createEventDispatcher } from "svelte"

  interface FormValues {
    name: string
    url: string | undefined
    iconName: string
    iconColor: string
  }

  export let app: any = null // This will be set by the parent component
  export let filteredApps: any[] = [] // This will be set by the parent component

  export let appName: string | undefined = ""
  export let appURL: string | undefined = ""
  export let appIconName: string | undefined = ""
  export let appIconColor: string | undefined = ""

  export let appMeta: FormValues = {
    url: undefined,
    name: "",
    iconName: "",
    iconColor: "",
  }

  export let alignActions = "left"

  const values = writable<FormValues>(appMeta)
  const validation = createValidationStore()
  const dispatch = createEventDispatcher()

  let updating = false
  let initialised = false

  $: filteredApps = $appsStore.apps.filter(app => app.devId === $appStore.appId)
  $: app = filteredApps[0]
  $: appDeployed = app?.status === AppStatus.DEPLOYED

  $: appName = $appStore.name
  $: appURL = $appStore.url
  $: appIconName = $appStore.icon?.name
  $: appIconColor = $appStore.icon?.color

  $: appMeta = {
    name: appName,
    url: appURL,
    iconName: appIconName || "",
    iconColor: appIconColor || "",
  }

  const initForm = (appMeta: FormValues) => {
    values.set({
      ...appMeta,
    })

    if (!initialised) {
      setupValidation()
      initialised = true
    }
  }

  const validate = (vals: Record<string, any>) => {
    const { url } = vals || {}
    validation.check({
      ...vals,
      url: url?.[0] === "/" ? url.substring(1, url.length) : url,
    })
  }

  // On workspace/apps update, reset the state.
  $: initForm(appMeta)
  $: validate($values)

  const resolveAppUrl = (name: string | undefined) => {
    let parsedName
    const resolvedName = resolveAppName(null, name)
    parsedName = resolvedName ? resolvedName.toLowerCase() : ""
    const parsedUrl = parsedName ? parsedName.replace(/\s+/g, "-") : ""
    return encodeURI(parsedUrl)
  }

  const nameToUrl = (appName: string | undefined) => {
    let resolvedUrl = resolveAppUrl(appName)
    tidyUrl(resolvedUrl)
  }

  const resolveAppName = (
    template: { name: string } | null,
    name: string | undefined
  ) => {
    if (template && !name) {
      return template.name
    }
    return name ? name.trim() : null
  }

  const tidyUrl = (url: string | undefined) => {
    if (url && !url.startsWith("/")) {
      url = `/${url}`
    }
    $values.url = url === "" ? undefined : url
  }

  const updateIcon = (e: CustomEvent<{ name: string; color: string }>) => {
    const { name, color } = e.detail
    $values.iconColor = color
    $values.iconName = name
  }

  const setupValidation = async () => {
    appValidation.name(validation, {
      apps: $appsStore.apps,
      currentApp: app,
    })
    appValidation.url(validation, {
      apps: $appsStore.apps,
      currentApp: app,
    })
  }

  async function updateApp() {
    try {
      await appsStore.save($appStore.appId, {
        name: $values.name?.trim(),
        url: $values.url?.trim(),
        icon: {
          name: $values.iconName,
          color: $values.iconColor,
        },
      })

      await initialiseApp()
      notifications.success("Workspace update successful")
    } catch (error) {
      console.error(error)
      notifications.error("Error updating workspace")
    }
  }

  const initialiseApp = async () => {
    const applicationPkg = await API.fetchAppPackage($appStore.appId)
    await initialise(applicationPkg)
  }
</script>

<div class="form">
  <div class="fields">
    <div class="field">
      <Label size="L">Name</Label>
      <Input
        bind:value={$values.name}
        error={$validation.touched.name && $validation.errors.name}
        on:blur={() => ($validation.touched.name = true)}
        on:change={() => nameToUrl($values.name)}
        disabled={appDeployed}
      />
    </div>
    <div class="field">
      <Label size="L">URL</Label>
      <Input
        bind:value={$values.url}
        error={$validation.touched.url && $validation.errors.url}
        on:blur={() => ($validation.touched.url = true)}
        on:change={() => tidyUrl($values.url)}
        placeholder={$values.url
          ? $values.url
          : `/${resolveAppUrl($values.name)}`}
        disabled={appDeployed}
      />
    </div>
    <div class="field">
      <Label size="L">Icon</Label>
      <EditableIcon
        size="XL"
        name={$values.iconName}
        color={$values.iconColor}
        on:change={updateIcon}
        disabled={appDeployed}
      />
    </div>
    <div class="actions" class:right={alignActions === "right"}>
      {#if !appDeployed}
        <Button
          cta
          on:click={async () => {
            updating = true
            await updateApp()
            updating = false
            dispatch("updated")
          }}
          disabled={appDeployed || updating || !$validation.valid}
        >
          Save
        </Button>
      {:else}
        <div class="edit-info">
          <Icon size="M" name="info" />
          <Body size="S">Unpublish your workspace to edit name and URL</Body>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .actions {
    display: flex;
  }
  .actions.right {
    justify-content: end;
  }
  .fields {
    display: grid;
    grid-gap: var(--spacing-l);
  }
  .field {
    display: grid;
    grid-template-columns: 80px 220px;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
  .edit-info {
    display: flex;
    gap: var(--spacing-m);
  }
</style>
