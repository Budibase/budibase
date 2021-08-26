<script>
  import { writable, get as svelteGet } from "svelte/store"
  import {
    notifications,
    Input,
    Modal,
    ModalContent,
    Body,
  } from "@budibase/bbui"
  import { hostingStore } from "builderStore"
  import { apps } from "stores/portal"
  import { string, object } from "yup"
  import { onMount } from "svelte"
  import { capitalise } from "helpers"
  import { APP_NAME_REGEX } from "constants"

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
  }

  export let app

  let modal
  let valid = false
  let dirty = false
  $: checkValidity($values, validator)
  $: {
    // prevent validation by setting name to undefined without an app
    if (app) {
      $values.name = app?.name
    }
  }

  onMount(async () => {
    await hostingStore.actions.fetchDeployedApps()
    const existingAppNames = svelteGet(hostingStore).deployedAppNames
    validator.name = string()
      .trim()
      .required("Your application must have a name")
      .matches(
        APP_NAME_REGEX,
        "App name must be letters, numbers and spaces only"
      )
      .test(
        "non-existing-app-name",
        "Another app with the same name already exists",
        value => {
          return !existingAppNames.some(
            appName => dirty && appName.toLowerCase() === value.toLowerCase()
          )
        }
      )
  })

  const checkValidity = async (values, validator) => {
    const obj = object().shape(validator)
    Object.keys(validator).forEach(key => ($errors[key] = null))
    try {
      await obj.validate(values, { abortEarly: false })
    } catch (validationErrors) {
      validationErrors.inner.forEach(error => {
        $errors[error.path] = capitalise(error.message)
      })
    }
    valid = await obj.isValid(values)
  }

  async function updateApp() {
    try {
      // Update App
      await apps.update(app.instance._id, $values.name.trim())
      hide()
    } catch (error) {
      console.error(error)
      notifications.error(error)
    }
  }

  export const show = () => {
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  const onCancel = () => {
    hide()
  }

  const onShow = () => {
    dirty = false
  }
</script>

<Modal bind:this={modal} on:hide={onCancel} on:show={onShow}>
  <ModalContent
    title={"Edit app"}
    confirmText={"Save"}
    onConfirm={updateApp}
    disabled={!(valid && dirty)}
  >
    <Body size="S">Update the name of your app.</Body>
    <Input
      bind:value={$values.name}
      error={$touched.name && $errors.name}
      on:blur={() => ($touched.name = true)}
      on:change={() => (dirty = true)}
      label="Name"
    />
  </ModalContent>
</Modal>
