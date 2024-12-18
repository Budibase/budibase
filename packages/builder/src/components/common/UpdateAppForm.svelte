<script>
  import { Button, Label, Icon, Input, notifications } from "@budibase/bbui"
  import { AppStatus } from "@/constants"
  import { appStore, initialise } from "@/stores/builder"
  import { appsStore } from "@/stores/portal"
  import { API } from "@/api"
  import { writable } from "svelte/store"
  import { createValidationStore } from "@/helpers/validation/yup"
  import * as appValidation from "@/helpers/validation/yup/app"
  import EditableIcon from "@/components/common/EditableIcon.svelte"
  import { isEqual } from "lodash"
  import { createEventDispatcher } from "svelte"

  export let alignActions = "left"

  const values = writable({})
  const validation = createValidationStore()
  const dispatch = createEventDispatcher()

  let updating = false
  let edited = false
  let initialised = false

  $: filteredApps = $appsStore.apps.filter(app => app.devId == $appStore.appId)
  $: app = filteredApps.length ? filteredApps[0] : {}
  $: appDeployed = app?.status === AppStatus.DEPLOYED

  $: appName = $appStore.name
  $: appURL = $appStore.url
  $: appIconName = $appStore.icon?.name
  $: appIconColor = $appStore.icon?.color

  $: appMeta = {
    name: appName,
    url: appURL,
    iconName: appIconName,
    iconColor: appIconColor,
  }

  const initForm = appMeta => {
    edited = false
    values.set({
      ...appMeta,
    })

    if (!initialised) {
      setupValidation()
      initialised = true
    }
  }

  const validate = (vals, appMeta) => {
    const { url } = vals || {}
    validation.check({
      ...vals,
      url: url?.[0] === "/" ? url.substring(1, url.length) : url,
    })
    edited = !isEqual(vals, appMeta)
  }

  // On app/apps update, reset the state.
  $: initForm(appMeta)
  $: validate($values, appMeta)

  const resolveAppUrl = (template, name) => {
    let parsedName
    const resolvedName = resolveAppName(null, name)
    parsedName = resolvedName ? resolvedName.toLowerCase() : ""
    const parsedUrl = parsedName ? parsedName.replace(/\s+/g, "-") : ""
    return encodeURI(parsedUrl)
  }

  const nameToUrl = appName => {
    let resolvedUrl = resolveAppUrl(null, appName)
    tidyUrl(resolvedUrl)
  }

  const resolveAppName = (template, name) => {
    if (template && !name) {
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

  const updateIcon = e => {
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
      notifications.success("App update successful")
    } catch (error) {
      console.error(error)
      notifications.error("Error updating app")
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
        on:change={nameToUrl($values.name)}
        disabled={appDeployed}
      />
    </div>
    <div class="field">
      <Label size="L">URL</Label>
      <Input
        bind:value={$values.url}
        error={$validation.touched.url && $validation.errors.url}
        on:blur={() => ($validation.touched.url = true)}
        on:change={tidyUrl($values.url)}
        placeholder={$values.url
          ? $values.url
          : `/${resolveAppUrl(null, $values.name)}`}
        disabled={appDeployed}
      />
    </div>
    <div class="field">
      <Label size="L">Icon</Label>
      <EditableIcon
        {app}
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
          disabled={appDeployed || updating || !edited || !$validation.valid}
        >
          Save
        </Button>
      {:else}
        <div class="edit-info">
          <Icon size="S" name="Info" /> Unpublish your app to edit name and URL
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
    gap: var(--spacing-s);
  }
</style>
