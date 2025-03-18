<script lang="ts">
  import { oauth2 } from "@/stores/builder"
  import type { OAuth2Config } from "@/types"
  import {
    Body,
    Divider,
    Heading,
    Input,
    keepOpen,
    Link,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import type { ZodType } from "zod"
  import { z } from "zod"

  export let config: OAuth2Config | undefined = undefined

  let errors: Record<string, string> = {}
  let hasBeenSubmitted = false

  $: isNew = !config

  $: data = (config as Partial<OAuth2Config>) ?? {}

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
    }) satisfies ZodType<OAuth2Config>

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

    try {
      await oauth2.create(validationResult.data)
    } catch (e: any) {
      notifications.error(e.message)
      return keepOpen
    }
  }

  $: hasBeenSubmitted && validateConfig(data)
</script>

<ModalContent onConfirm={saveOAuth2Config} size="M">
  <Heading size="S">Create new OAuth2 connection</Heading>

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
    type="password"
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
