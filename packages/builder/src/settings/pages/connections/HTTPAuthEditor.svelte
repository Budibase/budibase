<script lang="ts">
  import { onMount } from "svelte"
  import { createEventDispatcher } from "svelte"
  import { Layout, Body, Input, notifications } from "@budibase/bbui"
  import { BindableCombobox } from "@/components/common/bindings"
  import { getAuthBindings, getEnvironmentBindings } from "@/dataBinding"
  import { environment, licensing } from "@/stores/portal"
  import EnvVariableInput from "@/components/portal/environment/EnvVariableInput.svelte"
  import { RestAuthType, type RestAuthConfig } from "@budibase/types"
  import { cloneDeep } from "lodash/fp"

  export let config: RestAuthConfig | undefined = undefined
  export let existingConfigs: RestAuthConfig[] = []

  const dispatch = createEventDispatcher()

  interface FormData {
    _id?: string
    name?: string
    type?: RestAuthType
    config: {
      username?: string
      password?: string
      token?: string
    }
  }

  let data: FormData = {
    type: RestAuthType.BASIC,
    config: {},
  }
  let errors: Record<string, any> = {}
  let blurred: Record<string, any> = {}

  onMount(async () => {
    try {
      await environment.loadVariables()
    } catch (error) {
      notifications.error(`Error getting environment variables - ${error}`)
    }

    if (config) {
      data = cloneDeep(config) as FormData
    }
  })

  const validate = (): boolean => {
    errors = {}

    if (!data.name) {
      errors.name = "Name is required"
    } else if (
      existingConfigs.find(c => c.name === data.name && c._id !== data._id)
    ) {
      errors.name = "Name must be unique"
    }

    if (!data.type) {
      errors.type = "Type is required"
    }

    if (data.type === RestAuthType.BASIC) {
      if (!data.config.username) {
        errors.username = "Username is required"
      }
      if (!data.config.password) {
        errors.password = "Password is required"
      }
    } else if (data.type === RestAuthType.BEARER) {
      if (!data.config.token) {
        errors.token = "Token is required"
      }
    }

    return Object.keys(errors).length === 0
  }

  export const getConfig = (opts?: {
    showErrors?: boolean
  }): RestAuthConfig | null => {
    if (opts?.showErrors) {
      blurred = {
        name: true,
        type: true,
        username: true,
        password: true,
        token: true,
      }
    }
    if (!validate()) {
      return null
    }

    if (data.type === RestAuthType.BASIC) {
      return {
        _id: data._id || crypto.randomUUID(),
        name: data.name!,
        type: RestAuthType.BASIC,
        config: {
          username: data.config.username!,
          password: data.config.password!,
        },
      }
    } else {
      return {
        _id: data._id || crypto.randomUUID(),
        name: data.name!,
        type: RestAuthType.BEARER,
        config: {
          token: data.config.token!,
        },
      }
    }
  }

  const onFieldChange = () => {
    validate()
    dispatch("update", data)
  }
</script>

<Layout noPadding>
  <Layout gap="S" noPadding>
    <Body size="S">
      The authorization header will be automatically generated when you send the
      request.
    </Body>

    <div class="wrap">
      <Input
        label="Name"
        bind:value={data.name}
        on:change={onFieldChange}
        on:blur={() => (blurred.name = true)}
        error={blurred.name ? errors.name : undefined}
        required
      />
      {#if data.type === RestAuthType.BASIC}
        <EnvVariableInput
          label="Username"
          bind:value={data.config.username}
          on:change={onFieldChange}
          on:blur={() => (blurred.username = true)}
          error={blurred.username ? errors.username : undefined}
          autocomplete="off"
          required
        />

        <EnvVariableInput
          label="Password"
          type="password"
          bind:value={data.config.password}
          on:change={onFieldChange}
          on:blur={() => (blurred.password = true)}
          error={blurred.password ? errors.password : undefined}
          autocomplete="new-password"
          required
        />
      {/if}

      {#if data.type === RestAuthType.BEARER}
        <BindableCombobox
          label="Token"
          bind:value={data.config.token}
          bindings={[
            ...getAuthBindings(),
            ...($licensing.environmentVariablesEnabled
              ? getEnvironmentBindings()
              : []),
          ]}
          on:change={e => {
            data.config.token = e.detail
            onFieldChange()
          }}
          on:blur={() => {
            blurred.token = true
            onFieldChange()
          }}
          placeholder="Token"
          appendBindingsAsOptions={true}
          error={blurred.token ? errors.token : null}
          required
        />
      {/if}
    </div>
  </Layout>
</Layout>

<style>
  .wrap {
    max-width: 75%;
    display: flex;
    flex-direction: column;
    gap: var(--spectrum-alias-grid-gutter-xsmall);
  }
</style>
