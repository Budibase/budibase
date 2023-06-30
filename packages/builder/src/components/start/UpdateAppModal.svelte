<script>
  import { writable, get as svelteGet } from "svelte/store"
  import {
    notifications,
    Input,
    ModalContent,
    Layout,
    Label,
  } from "@budibase/bbui"
  import { apps } from "stores/portal"
  import { onMount } from "svelte"
  import { createValidationStore } from "helpers/validation/yup"
  import * as appValidation from "helpers/validation/yup/app"
  import EditableIcon from "../common/EditableIcon.svelte"

  export let app
  export let onUpdateComplete

  $: appIdParts = app.appId ? app.appId?.split("_") : []
  $: appId = appIdParts.slice(-1)[0]

  const values = writable({
    name: app.name,
    url: app.url,
    iconName: app.icon?.name,
    iconColor: app.icon?.color,
  })
  const validation = createValidationStore()

  $: {
    const { url } = $values

    validation.check({
      ...$values,
      url: url?.[0] === "/" ? url.substring(1, url.length) : url,
    })
  }

  const setupValidation = async () => {
    const applications = svelteGet(apps)
    appValidation.name(validation, {
      apps: applications,
      currentApp: {
        ...app,
        appId,
      },
    })
    appValidation.url(validation, {
      apps: applications,
      currentApp: {
        ...app,
        appId,
      },
    })
    // init validation
    const { url } = $values
    validation.check({
      ...$values,
      url: url?.[0] === "/" ? url.substring(1, url.length) : url,
    })
  }

  async function updateApp() {
    try {
      await apps.update(app.appId, {
        name: $values.name?.trim(),
        url: $values.url?.trim(),
        icon: {
          name: $values.iconName,
          color: $values.iconColor,
        },
      })
      if (typeof onUpdateComplete == "function") {
        onUpdateComplete()
      }
    } catch (error) {
      console.error(error)
      notifications.error("Error updating app")
    }
  }

  const resolveAppUrl = (template, name) => {
    let parsedName
    const resolvedName = resolveAppName(null, name)
    parsedName = resolvedName ? resolvedName.toLowerCase() : ""
    const parsedUrl = parsedName ? parsedName.replace(/\s+/g, "-") : ""
    return encodeURI(parsedUrl)
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

  const nameToUrl = appName => {
    let resolvedUrl = resolveAppUrl(null, appName)
    tidyUrl(resolvedUrl)
  }

  const updateIcon = e => {
    const { name, color } = e.detail
    $values.iconColor = color
    $values.iconName = name
  }

  onMount(setupValidation)
</script>

<ModalContent
  title="Edit name and URL"
  confirmText="Save"
  onConfirm={updateApp}
  disabled={!$validation.valid}
>
  <Input
    bind:value={$values.name}
    error={$validation.touched.name && $validation.errors.name}
    on:blur={() => ($validation.touched.name = true)}
    on:change={nameToUrl($values.name)}
    label="Name"
  />
  <Layout noPadding gap="XS">
    <Label>Icon</Label>
    <EditableIcon
      {app}
      size="XL"
      name={$values.iconName}
      color={$values.iconColor}
      on:change={updateIcon}
    />
  </Layout>
  <Input
    bind:value={$values.url}
    error={$validation.touched.url && $validation.errors.url}
    on:blur={() => ($validation.touched.url = true)}
    on:change={tidyUrl($values.url)}
    label="URL"
    placeholder={$values.url
      ? $values.url
      : `/${resolveAppUrl(null, $values.name)}`}
  />
</ModalContent>
