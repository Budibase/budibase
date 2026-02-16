<script lang="ts">
  import { z } from "zod"
  import { onMount } from "svelte"
  import { createEventDispatcher } from "svelte"
  import EnvVariableInput from "@/components/portal/environment/EnvVariableInput.svelte"
  import { Body, Divider, Input, Link, Select, Layout } from "@budibase/bbui"
  import type {
    InsertOAuth2ConfigRequest,
    OAuth2AuthConfig,
  } from "@budibase/types"
  import {
    OAuth2CredentialsMethod,
    OAuth2GrantType,
    PASSWORD_REPLACEMENT,
  } from "@budibase/types"
  import type { ZodType } from "zod"
  import { cloneDeep } from "lodash/fp"
  import type { OAuth2Config } from "@/types"

  export let config: OAuth2Config | OAuth2AuthConfig | undefined = undefined
  export let existingConfigs: (OAuth2Config | OAuth2AuthConfig)[] = []

  const dispatch = createEventDispatcher()

  const methods = [
    {
      label: "Basic",
      value: OAuth2CredentialsMethod.HEADER,
    },
    {
      label: "POST",
      value: OAuth2CredentialsMethod.BODY,
    },
  ]

  const requiredString = (errorMessage: string) =>
    z.string({ required_error: errorMessage }).trim().min(1, errorMessage)

  let errors: Record<string, string> = {}
  let blurred: Record<string, boolean> = {}

  // Form state
  let data: Partial<OAuth2AuthConfig> = {}

  $: isProtectedPassword =
    data?.clientSecret === PASSWORD_REPLACEMENT ||
    data?.clientSecret?.match(/{{\s*env\.[^\s]+\s*}}/)

  const onUpdate = (
    field: keyof OAuth2AuthConfig,
    value: string | undefined
  ) => {
    const normalizedValue = value || undefined
    if ((data[field] || undefined) === normalizedValue) {
      return
    }
    if (normalizedValue === undefined) {
      delete data[field]
      data = data // trigger reactivity
    } else {
      ;(data as Record<string, unknown>)[field] = normalizedValue
    }
    onFieldChange()
  }

  const getInitialData = (
    config: OAuth2Config | OAuth2AuthConfig | undefined
  ): Partial<OAuth2AuthConfig> => {
    const initial: Partial<OAuth2AuthConfig> = config ? cloneDeep(config) : {}
    initial.type = "oauth2"
    initial.grantType ??= OAuth2GrantType.CLIENT_CREDENTIALS
    return initial
  }

  onMount(() => {
    data = getInitialData(config)
  })

  const validate = (): boolean => {
    const validator = z.object({
      name: requiredString("Name is required.").refine(
        val =>
          !existingConfigs
            .filter(c => c._id !== data._id)
            .map(c => c.name.toLowerCase())
            .includes(val.toLowerCase()),
        {
          message: "This name is already taken.",
        }
      ),
      url: requiredString("Url is required.").url(),
      clientId: requiredString("Client ID is required."),
      clientSecret: requiredString("Client secret is required."),
      method: z.nativeEnum(OAuth2CredentialsMethod, {
        message: "Authentication method is required.",
      }),
      grantType: z.nativeEnum(OAuth2GrantType, {
        message: "Grant type is required.",
      }),
      scope: z
        .string()
        .transform(s => s || undefined)
        .optional(),
      audience: z
        .string()
        .transform(s => s || undefined)
        .optional(),
    }) satisfies ZodType<InsertOAuth2ConfigRequest>

    const validationResult = validator.safeParse(data)
    errors = {}
    if (!validationResult.success) {
      const flattened = validationResult.error.flatten()
      errors = Object.entries(flattened.fieldErrors).reduce<
        Record<string, string>
      >((acc, [field, fieldErrors]) => {
        if (fieldErrors?.[0]) {
          acc[field] = fieldErrors[0]
        }
        return acc
      }, {})
    }

    return validationResult.success
  }

  export const getConfig = (opts?: {
    showErrors?: boolean
  }): OAuth2AuthConfig | null => {
    if (opts?.showErrors) {
      blurred = {
        name: true,
        url: true,
        clientId: true,
        clientSecret: true,
        method: true,
        grantType: true,
        scope: true,
        audience: true,
      }
    }
    if (!validate()) {
      return null
    }

    return {
      _id: data._id || crypto.randomUUID(),
      type: "oauth2",
      name: data.name!,
      url: data.url!,
      clientId: data.clientId!,
      clientSecret: data.clientSecret!,
      method: data.method!,
      grantType: data.grantType!,
      scope: data.scope,
      audience: data.audience,
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
      The OAuth 2 authentication below uses the Client Credentials (machine to
      machine) grant type. <Link
        href="https://docs.budibase.com/docs/rest-oauth2"
        target="_blank"
        size="M"
      >
        Learn more
      </Link>
    </Body>
    <Divider noGrid noMargin />
    <div class="wrap">
      <Input
        label="Display name"
        placeholder="Type here..."
        value={data.name}
        on:change={e => onUpdate("name", e.detail)}
        on:blur={() => (blurred.name = true)}
        error={blurred.name ? errors.name : undefined}
        required
      />
      <Select
        label="Authentication method"
        options={methods}
        getOptionLabel={o => o.label}
        getOptionValue={o => o.value}
        value={data.method}
        on:change={e => {
          data.method = e.detail
          onFieldChange()
        }}
        on:blur={() => (blurred.method = true)}
        error={blurred.method ? errors.method : undefined}
        required
      />
      <div class="field-info">
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          Basic will use the Authorisation Bearer header for each connection,
          while POST will include the credentials in the body of the request
          under the access_token property.
        </Body>
      </div>

      <Select
        label="Grant type"
        options={[
          {
            label: "Client credentials",
            value: OAuth2GrantType.CLIENT_CREDENTIALS,
          },
        ]}
        value={data.grantType}
        on:change={e => {
          data.grantType = e.detail
          onFieldChange()
        }}
        on:blur={() => (blurred.grantType = true)}
        error={blurred.grantType ? errors.grantType : undefined}
        disabled
        required
      />
      <div class="field-info">
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          Only client credentials mode is supported currently.
        </Body>
      </div>
      <Input
        label="Service URL"
        placeholder="E.g. www.google.com"
        value={data.url}
        on:change={e => onUpdate("url", e.detail)}
        on:blur={() => (blurred.url = true)}
        error={blurred.url ? errors.url : undefined}
        required
      />
      <div class="field-info">
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          The location where the flow sends the credentials. This field should
          be a full URL.
        </Body>
      </div>
      <EnvVariableInput
        label="Client ID"
        placeholder="Type here..."
        value={data.clientId}
        on:change={e => onUpdate("clientId", e.detail)}
        on:blur={() => (blurred.clientId = true)}
        error={blurred.clientId ? errors.clientId : undefined}
        autocomplete="off"
        required
      />
      <EnvVariableInput
        type={!isProtectedPassword ? "password" : "text"}
        label="Client secret"
        placeholder="Type here..."
        value={data.clientSecret}
        on:change={e => onUpdate("clientSecret", e.detail)}
        on:blur={() => (blurred.clientSecret = true)}
        error={blurred.clientSecret ? errors.clientSecret : undefined}
        autocomplete="new-password"
        required
      />
      <!-- TODO definitiely make this a lookup field in the future -->
      <Input
        label="Scope"
        placeholder="Space-separated scopes (optional)"
        value={data.scope}
        on:change={e => onUpdate("scope", e.detail)}
        on:blur={() => (blurred.scope = true)}
        error={blurred.scope ? errors.scope : undefined}
      />
      <Input
        label="Audience (Optional)"
        placeholder="E.g. bbdemo, https://api.myapp.com"
        value={data.audience}
        on:change={e => onUpdate("audience", e.detail)}
        on:blur={() => (blurred.audience = true)}
        error={blurred.audience ? errors.audience : undefined}
      />
      <div class="field-info">
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          The intended recipient of the token. Required by some providers like
          Auth0.
        </Body>
      </div>
    </div>
  </Layout>
</Layout>

<style>
  .field-info {
    margin-top: calc(var(--spacing-xl) * -1 + var(--spacing-s));
  }
  .wrap {
    max-width: 75%;
    display: flex;
    flex-direction: column;
    gap: var(--spectrum-alias-grid-gutter-xsmall);
  }
</style>
