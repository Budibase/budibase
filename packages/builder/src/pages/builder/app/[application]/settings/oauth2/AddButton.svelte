<script lang="ts">
  import { oauth2 } from "@/stores/builder"
  import type { CreateOAuth2Config } from "@/types"
  import {
    Body,
    Button,
    Divider,
    Heading,
    Input,
    keepOpen,
    Link,
    Modal,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import type { ZodType } from "zod"
  import { z } from "zod"

  let modal: Modal

  function openModal() {
    config = {}
    errors = {}
    hasBeenSubmitted = false
    modal.show()
  }

  let config: Partial<CreateOAuth2Config> = {}
  let errors: Record<string, string> = {}
  let hasBeenSubmitted = false

  const requiredString = (errorMessage: string) =>
    z.string({ required_error: errorMessage }).trim().min(1, errorMessage)

  const validateConfig = (config: Partial<CreateOAuth2Config>) => {
    const validator = z.object({
      name: requiredString("Name is required.").refine(
        val =>
          !$oauth2.configs
            .map(c => c.name.toLowerCase())
            .includes(val.toLowerCase()),
        {
          message: "This name is already taken.",
        }
      ),
      url: requiredString("Url is required.").url(),
      clientId: requiredString("Client ID is required."),
      clientSecret: requiredString("Client secret is required."),
    }) satisfies ZodType<CreateOAuth2Config>

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
    const validationResult = validateConfig(config)
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

  $: hasBeenSubmitted && validateConfig(config)
</script>

<Button cta size="M" on:click={openModal}>Add OAuth2</Button>
<Modal bind:this={modal}>
  <ModalContent onConfirm={saveOAuth2Config} size="M">
    <Heading size="S">Create new OAuth2 connection</Heading>
    <Body size="S">
      The OAuth 2 authentication below uses the Client Credentials (machine to
      machine) grant type.
    </Body>
    <Divider noGrid noMargin />
    <Input error={errors.name} />
    <Input
      label="Service URL*"
      placeholder="E.g. www.google.com"
      error={errors.url}
    />
    <div class="field-info">
      <Body size="XS" color="var(--spectrum-global-color-gray-700)">
        The location where the flow sends the credentials. This field should be
        a full URL.
      </Body>
    </div>
    <Input
      label="Client ID*"
      placeholder="Type here..."
      bind:value={config.clientId}
      error={errors.clientId}
    />
    <Input
      type="password"
      label="Client secret*"
      placeholder="Type here..."
      bind:value={config.clientSecret}
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
</Modal>

<style>
  .field-info {
    margin-top: calc(var(--spacing-xl) * -1 + var(--spacing-s));
  }
</style>
