<script>
  import { writable, get as svelteGet } from "svelte/store"
  import {
    notifications,
    Input,
    ModalContent,
    Dropzone,
    Body,
    Checkbox,
  } from "@budibase/bbui"
  import { store, automationStore, hostingStore } from "builderStore"
  import { admin, auth } from "stores/portal"
  import { string, mixed, object } from "yup"
  import api, { get, post } from "builderStore/api"
  import analytics, { Events } from "analytics"
  import { onMount } from "svelte"
  import { capitalise } from "helpers"
  import { goto } from "@roxi/routify"
  import { APP_NAME_REGEX } from "constants"
  import TemplateList from "./TemplateList.svelte"

  export let template
  export let inline

  const values = writable({ name: null })
  const errors = writable({})
  const touched = writable({})
  const validator = {
    name: string()
      .trim()
      .required("Your application must have a name")
      .matches(
        APP_NAME_REGEX,
        "App name must be letters, numbers and spaces only"
      ),
    file: template?.fromFile
      ? mixed().required("Please choose a file to import")
      : null,
  }

  let submitting = false
  let valid = false
  let initialTemplateInfo = template?.fromFile || template?.key

  $: checkValidity($values, validator)
  $: showTemplateSelection = !template && !initialTemplateInfo

  onMount(async () => {
    await hostingStore.actions.fetchDeployedApps()
    const existingAppNames = svelteGet(hostingStore).deployedAppNames
    validator.name = string()
      .trim()
      .required("Your application must have a name")
      .matches(APP_NAME_REGEX, "App name must be letters and numbers only")
      .test(
        "non-existing-app-name",
        "Another app with the same name already exists",
        value => {
          return !existingAppNames.some(
            appName => appName.toLowerCase() === value.toLowerCase()
          )
        }
      )
  })

  const checkValidity = async (values, validator) => {
    const obj = object().shape(validator)
    Object.keys(validator).forEach(key => ($errors[key] = null))
    if (template?.fromFile && values.file == null) {
      valid = false
      return
    }

    try {
      await obj.validate(values, { abortEarly: false })
    } catch (validationErrors) {
      validationErrors.inner.forEach(error => {
        $errors[error.path] = capitalise(error.message)
      })
    }

    valid = await obj.isValid(values)
  }

  async function createNewApp() {
    const templateToUse = Object.keys(template).length === 0 ? null : template
    submitting = true

    // Check a template exists if we are important
    if (templateToUse?.fromFile && !$values.file) {
      $errors.file = "Please choose a file to import"
      valid = false
      submitting = false
      return false
    }

    try {
      // Create form data to create app
      let data = new FormData()
      data.append("name", $values.name.trim())
      data.append("useTemplate", templateToUse != null)
      if (templateToUse) {
        data.append("templateName", templateToUse.name)
        data.append("templateKey", templateToUse.key)
        data.append("templateFile", $values.file)
      }

      // Create App
      const appResp = await post("/api/applications", data, {})
      const appJson = await appResp.json()
      if (!appResp.ok) {
        throw new Error(appJson.message)
      }

      analytics.captureEvent(Events.APP.CREATED, {
        name: $values.name,
        appId: appJson.instance._id,
        templateToUse,
      })

      // Select Correct Application/DB in prep for creating user
      const applicationPkg = await get(
        `/api/applications/${appJson.instance._id}/appPackage`
      )
      const pkg = await applicationPkg.json()
      if (applicationPkg.ok) {
        await store.actions.initialise(pkg)
        await automationStore.actions.fetch()
        // update checklist - incase first app
        await admin.init()
      } else {
        throw new Error(pkg)
      }

      // Create user
      const user = {
        roleId: $values.roleId,
      }
      const userResp = await api.post(`/api/users/metadata/self`, user)
      await userResp.json()
      await auth.setInitInfo({})
      $goto(`/builder/app/${appJson.instance._id}`)
    } catch (error) {
      console.error(error)
      notifications.error(error)
      submitting = false
    }
  }

  function getModalTitle() {
    let title = "Create App"
    if (template.fromFile) {
      title = "Import App"
    } else if (template.key) {
      title = "Create app from template"
    }
    return title
  }

  async function onCancel() {
    template = null
    await auth.setInitInfo({})
  }
</script>

{#if showTemplateSelection}
  <ModalContent
    title={"Get started quickly"}
    showConfirmButton={false}
    size="L"
    onConfirm={() => {
      template = {}
      return false
    }}
    showCancelButton={!inline}
    showCloseIcon={!inline}
  >
    <TemplateList
      onSelect={(selected, { useImport } = {}) => {
        if (!selected) {
          template = useImport ? { fromFile: true } : {}
          return
        }
        template = selected
      }}
    />
  </ModalContent>
{:else}
  <ModalContent
    title={getModalTitle()}
    confirmText={template?.fromFile ? "Import app" : "Create app"}
    onConfirm={createNewApp}
    onCancel={inline ? onCancel : null}
    cancelText={inline ? "Back" : undefined}
    showCloseIcon={!inline}
    disabled={!valid}
  >
    {#if template?.fromFile}
      <Dropzone
        error={$touched.file && $errors.file}
        gallery={false}
        label="File to import"
        value={[$values.file]}
        on:change={e => {
          $values.file = e.detail?.[0]
          $touched.file = true
        }}
      />
    {/if}
    <Body size="S">
      Give your new app a name, and choose which groups have access (paid plans
      only).
    </Body>
    <Input
      bind:value={$values.name}
      error={$touched.name && $errors.name}
      on:blur={() => ($touched.name = true)}
      label="Name"
    />
    <Checkbox label="Group access" disabled value={true} text="All users" />
  </ModalContent>
{/if}
