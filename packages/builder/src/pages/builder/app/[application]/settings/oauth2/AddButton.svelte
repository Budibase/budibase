<script lang="ts">
  import { oauth2 } from "@/stores/builder"
  import {
    Body,
    Button,
    Divider,
    Heading,
    Input,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import { type CreateOAuth2ConfigRequest } from "@budibase/types"
  import { onMount } from "svelte"

  let modal: Modal

  function openModal() {
    modal.show()
  }

  let config: Partial<CreateOAuth2ConfigRequest> = {}

  $: saveOAuth2Config = async () => {
    // TODO
  }

  onMount(() => {
    modal.show()
  })
</script>

<Button cta size="M" on:click={openModal}>Add OAuth2</Button>
<Modal bind:this={modal}>
  <ModalContent onConfirm={saveOAuth2Config}>
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
