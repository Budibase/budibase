<script lang="ts">
  import { oauth2 } from "@/stores/builder"
  import type { OAuth2Config, UpsertOAuth2Config } from "@/types"
  import {
    Body,
    Divider,
    Heading,
    Input,
    keepOpen,
    Link,
    ModalContent,
    notifications,
    Select,
  } from "@budibase/bbui"
  import {
    OAuth2CredentialsMethod,
    PASSWORD_REPLACEMENT,
  } from "@budibase/types"
  import type { ZodType } from "zod"
  import { z } from "zod"

  export let config: OAuth2Config | undefined = undefined

  let errors: Record<string, string> = {}
  let hasBeenSubmitted = false

  $: data = (config as Partial<OAuth2Config>) ?? {}

  $: isCreation = !config
  $: title = isCreation
    ? "Create new OAuth2 connection"
    : "Edit OAuth2 connection"

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

  const validateConfig = (config: Partial<OAuth2Config>) => {
    const validator = z.object({
      name: requiredString("Name is required.").refine(
        val =>
          !$oauth2.configs
            .filter(c => c.id !== config.id)
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
    }) satisfies ZodType<UpsertOAuth2Config>

    const validationResult = validator.safeParse(config)
    errors = {}
    if (!validationResult.success) {
      errors = Object.entries(
        validationResult.error.formErrors.fieldErrors
      ).reduce<Record<string, string>>((acc, [field, errors]) => {
        if (errors[0]) {
          acc[field] = errors[0]
        }
        return acc
      }, {})
    }

    return validationResult
  }

  $: saveOAuth2Config = async () => {
    hasBeenSubmitted = true
    const validationResult = validateConfig(data)
    if (validationResult.error) {
      return keepOpen
    }

    const { data: configData } = validationResult
    try {
      const connectionValidation = await oauth2.validate({
        id: config?.id,
        url: configData.url,
        clientId: configData.clientId,
        clientSecret: configData.clientSecret,
        method: configData.method,
      })
      if (!connectionValidation.valid) {
        let message = "Connection settings could not be validated"
        if (connectionValidation.message) {
          message += `: ${connectionValidation.message}`
        }
        notifications.error(message)
        return keepOpen
      }

      if (isCreation) {
        await oauth2.create(configData)
        notifications.success("Settings created.")
      } else {
        await oauth2.edit(config!.id, configData)
        notifications.success("Settings saved.")
      }
    } catch (e: any) {
      notifications.error(`Failed to save config - ${e.message}`)
      return keepOpen
    }
  }

  $: hasBeenSubmitted && validateConfig(data)

  $: isProtectedPassword = config?.clientSecret === PASSWORD_REPLACEMENT
</script>

<ModalContent onConfirm={saveOAuth2Config} size="M">
  <Heading size="S">{title}</Heading>

  <Body size="S">
    The OAuth 2 authentication below uses the Client Credentials (machine to
    machine) grant type.
  </Body>
  <Divider noGrid noMargin />
  <Input
    label="Name*"
    placeholder="Type here..."
    bind:value={data.name}
    error={errors.name}
  />
  <Select
    label="Authentication method*"
    options={methods}
    getOptionLabel={o => o.label}
    getOptionValue={o => o.value}
    bind:value={data.method}
    error={errors.method}
  />
  <div class="field-info">
    <Body size="XS" color="var(--spectrum-global-color-gray-700)">
      Basic will use the Authorisation Bearer header for each connection, while
      POST will include the credentials in the body of the request under the
      access_token property.
    </Body>
  </div>
  <Input
    label="Service URL*"
    placeholder="E.g. www.google.com"
    bind:value={data.url}
    error={errors.url}
  />
  <div class="field-info">
    <Body size="XS" color="var(--spectrum-global-color-gray-700)">
      The location where the flow sends the credentials. This field should be a
      full URL.
    </Body>
  </div>
  <Input
    label="Client ID*"
    placeholder="Type here..."
    bind:value={data.clientId}
    error={errors.clientId}
  />
  <Input
    type={!isProtectedPassword ? "password" : "text"}
    label="Client secret*"
    placeholder="Type here..."
    bind:value={data.clientSecret}
    error={errors.clientSecret}
  />
  <Body size="S"
    >To learn how to configure OAuth2, our documentation <Link
      href="TODO"
      target="_blank"
      size="M">our documentation.</Link
    ></Body
  >
</ModalContent>

<style>
  .field-info {
    margin-top: calc(var(--spacing-xl) * -1 + var(--spacing-s));
  }
</style>
