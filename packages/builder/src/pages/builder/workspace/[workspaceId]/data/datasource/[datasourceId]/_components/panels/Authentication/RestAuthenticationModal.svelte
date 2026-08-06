<script lang="ts">
  import { onMount } from "svelte"
  import {
    ModalContent,
    Layout,
    Select,
    Body,
    Input,
    notifications,
  } from "@budibase/bbui"
  import { AUTH_TYPE_LABELS, AUTH_TYPES } from "./authTypes"
  import { BindableCombobox } from "@/components/common/bindings"
  import { getAuthBindings, getEnvironmentBindings } from "@/dataBinding"
  import { environment, licensing } from "@/stores/portal"
  import EnvVariableInput from "@/components/portal/environment/EnvVariableInput.svelte"

  interface FormData {
    name?: string
    type?: string
    basic: {
      username?: string
      password?: string
    }
    bearer: {
      token?: string
    }
  }

  export let configs
  export let currentConfig
  export let onConfirm
  export let onRemove

  let form: FormData = {
    basic: {},
    bearer: {},
  }

  let errors: FormData = {
    basic: {},
    bearer: {},
  }

  let blurred: {
    name?: boolean
    type?: boolean
    basic: {
      username?: boolean
      password?: boolean
    }
    bearer: {
      token?: boolean
    }
  } = {
    basic: {},
    bearer: {},
  }

  let hasErrors = false
  let hasChanged = false

  onMount(async () => {
    if (currentConfig) {
      deconstructConfig()
    }
  })

  /**
   * map the current config's data into the form by type
   */
  const deconstructConfig = () => {
    form.name = currentConfig.name
    form.type = currentConfig.type

    if (currentConfig.type === AUTH_TYPES.BASIC) {
      form.basic = {
        ...currentConfig.config,
      }
    } else if (currentConfig.type === AUTH_TYPES.BEARER) {
      form.bearer = {
        ...currentConfig.config,
      }
    }
  }

  /**
   * map the form into a new config to save by type
   */
  const constructConfig = () => {
    const newConfig: any = {
      name: form.name,
      type: form.type,
    }

    if (currentConfig) {
      newConfig._id = currentConfig._id
    }

    if (form.type === AUTH_TYPES.BASIC) {
      newConfig.config = {
        ...form.basic,
      }
    } else if (form.type === AUTH_TYPES.BEARER) {
      newConfig.config = {
        ...form.bearer,
      }
    }

    return newConfig
  }

  /**
   * compare the existing config with the new config to see if there are any changes
   */
  const checkChanged = () => {
    if (currentConfig) {
      hasChanged =
        JSON.stringify(currentConfig) !== JSON.stringify(constructConfig())
    } else {
      hasChanged = true
    }
  }

  const checkErrors = () => {
    hasErrors = false

    // NAME
    const nameError = () => {
      // Unique name
      if (form.name) {
        errors.name =
          // check for duplicate excluding the current config
          configs.find(
            (c: any) => c.name === form.name && c.name !== currentConfig?.name
          ) !== undefined
            ? "Name must be unique"
            : undefined
      }
      // Name required
      else {
        errors.name = "Name is required"
      }
      return !!errors.name
    }

    // TYPE
    const typeError = () => {
      errors.type = form.type ? undefined : "Type is required"
      return !!errors.type
    }

    // BASIC AUTH
    const basicAuthErrors = () => {
      errors.basic.username = form.basic.username
        ? undefined
        : "Username is required"
      errors.basic.password = form.basic.password
        ? undefined
        : "Password is required"

      return !!(errors.basic.username || errors.basic.password || commonError)
    }

    // BEARER TOKEN
    const bearerTokenErrors = () => {
      errors.bearer.token = form.bearer.token ? undefined : "Token is required"
      return !!(errors.bearer.token || commonError)
    }

    const commonError = nameError() || typeError()
    if (form.type === AUTH_TYPES.BASIC) {
      hasErrors = basicAuthErrors() || commonError
    } else if (form.type === AUTH_TYPES.BEARER) {
      hasErrors = bearerTokenErrors() || commonError
    } else {
      hasErrors = !!commonError
    }
  }

  const onFieldChange = () => {
    checkErrors()
    checkChanged()
  }

  const onConfirmInternal = () => {
    onConfirm(constructConfig())
  }

  onMount(async () => {
    try {
      await environment.loadVariables()
    } catch (error) {
      notifications.error(`Error getting environment variables - ${error}`)
    }
  })
</script>

<ModalContent
  title={currentConfig ? "Update Authentication" : "Add Authentication"}
  onConfirm={onConfirmInternal}
  confirmText={currentConfig ? "Update" : "Add"}
  disabled={hasErrors || !hasChanged}
  cancelText={"Cancel"}
  size="M"
  showSecondaryButton={!!currentConfig}
  secondaryButtonText={"Remove"}
  secondaryAction={onRemove}
  secondaryButtonWarning={true}
>
  <Layout gap="S">
    <Body size="S">
      The authorization header will be automatically generated when you send the
      request.
    </Body>
    <Input
      label="Name"
      bind:value={form.name}
      on:change={onFieldChange}
      on:blur={() => (blurred.name = true)}
      error={blurred.name ? errors.name : undefined}
    />
    <Select
      label="Type"
      bind:value={form.type}
      on:change={onFieldChange}
      options={AUTH_TYPE_LABELS}
      on:blur={() => (blurred.type = true)}
      error={blurred.type ? errors.type : undefined}
    />
    {#if form.type === AUTH_TYPES.BASIC}
      <EnvVariableInput
        label="Username"
        bind:value={form.basic.username}
        on:change={onFieldChange}
        on:blur={() => (blurred.basic.username = true)}
        error={blurred.basic.username ? errors.basic.username : undefined}
      />

      <EnvVariableInput
        label="Password"
        type="password"
        bind:value={form.basic.password}
        on:change={onFieldChange}
        on:blur={() => (blurred.basic.password = true)}
        error={blurred.basic.password ? errors.basic.password : undefined}
      />
    {/if}
    {#if form.type === AUTH_TYPES.BEARER}
      <BindableCombobox
        label="Token"
        value={form.bearer.token}
        bindings={[
          ...getAuthBindings(),
          ...($licensing.environmentVariablesEnabled
            ? getEnvironmentBindings()
            : []),
        ]}
        on:change={e => {
          form.bearer.token = e.detail
          onFieldChange()
        }}
        on:blur={() => {
          blurred.bearer.token = true
          onFieldChange()
        }}
        placeholder="Token"
        appendBindingsAsOptions={true}
        error={blurred.bearer.token ? errors.bearer.token : null}
      />
    {/if}
  </Layout>
</ModalContent>
