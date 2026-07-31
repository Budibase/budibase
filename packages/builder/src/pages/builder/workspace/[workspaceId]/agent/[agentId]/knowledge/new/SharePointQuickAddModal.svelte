<script lang="ts">
  import {
    Body,
    Button,
    ButtonGroup,
    Input,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import type { SharePointQuickAddCredentials } from "./sharePointQuickAdd"

  export interface Props {
    saving?: boolean
    error?: string
    onSubmit: (_credentials: SharePointQuickAddCredentials) => Promise<void>
  }

  let { saving = false, error = "", onSubmit }: Props = $props()

  let modal = $state<Modal>()
  let tenantId = $state("")
  let clientId = $state("")
  let clientSecret = $state("")

  const canSubmit = $derived(
    !!tenantId.trim() && !!clientId.trim() && !!clientSecret.trim() && !saving
  )

  export function show() {
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const clearCredentials = () => {
    tenantId = ""
    clientId = ""
    clientSecret = ""
  }

  const submit = async () => {
    if (!canSubmit) {
      return
    }
    await onSubmit({ tenantId, clientId, clientSecret })
  }
</script>

<Modal bind:this={modal} disableCancel={saving} on:hide={clearCredentials}>
  <ModalContent
    custom
    showDivider={false}
    showConfirmButton={false}
    showCancelButton={false}
  >
    <div class="content">
      <div class="title">
        <Body size="S">Connect SharePoint</Body>
      </div>
      <Body size="S">
        Enter the credentials for your Microsoft Entra application.
      </Body>
      <div class="fields">
        <Input
          label="Directory (tenant) ID"
          bind:value={tenantId}
          autocomplete="off"
          required
        />
        <Input
          label="Application (client) ID"
          bind:value={clientId}
          autocomplete="off"
          required
        />
        <Input
          label="Client secret (value)"
          type="password"
          bind:value={clientSecret}
          autocomplete="new-password"
          required
        />
      </div>
      {#if error}
        <Body size="S" color="var(--spectrum-semantic-negative-color-default)">
          {error}
        </Body>
      {/if}
    </div>

    <ButtonGroup slot="footer">
      <Button cta primary on:click={submit} disabled={!canSubmit}>
        {saving ? "Connecting..." : error ? "Retry" : "Connect"}
      </Button>
    </ButtonGroup>
  </ModalContent>
</Modal>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    padding: var(--spacing-l);
    width: min(460px, 95vw);
  }

  .title {
    padding-bottom: var(--spacing-xs);
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
