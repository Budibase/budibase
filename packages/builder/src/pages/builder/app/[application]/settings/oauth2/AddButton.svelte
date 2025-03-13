<script lang="ts">
  import { oauth2 } from "@/stores/builder"
  import type { CreateOAuth2Config } from "@/types"
  import {
    Body,
    Button,
    Divider,
    Heading,
    Input,
    Modal,
    ModalContent,
  } from "@budibase/bbui"

  let modal: Modal

  function openModal() {
    modal.show()
  }

  let config: Partial<CreateOAuth2Config> = {}

  $: saveOAuth2Config = async () => {
    await oauth2.create(config as any) // TODO
  }
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
    <Input label="Name*" placeholder="Type here..." bind:value={config.name} />
    <Input
      label="Service URL*"
      placeholder="E.g. www.google.com"
      bind:value={config.url}
    />
    <div class="field-info">
      <Body size="XS" color="var(--spectrum-global-color-gray-700)"
        >The location where the flow sends the credentials. This field should be
        a full URL.</Body
      >
    </div>
    <Input
      label="Client ID*"
      placeholder="Type here..."
      bind:value={config.clientId}
    />
    <Input
      label="Client secret*"
      placeholder="Type here..."
      bind:value={config.clientSecret}
    />
  </ModalContent>
</Modal>

<style>
  .field-info {
    margin-top: calc(var(--spacing-xl) * -1 + var(--spacing-s));
  }
</style>
