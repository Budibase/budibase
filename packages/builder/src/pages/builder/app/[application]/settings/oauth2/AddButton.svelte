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
  import { onMount } from "svelte"

  let modal: Modal

  function openModal() {
    modal.show()
  }

  function saveOAuth2Config() {
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
    <Input label="Name*" placeholder="Type here..." />
  </ModalContent></Modal
>
