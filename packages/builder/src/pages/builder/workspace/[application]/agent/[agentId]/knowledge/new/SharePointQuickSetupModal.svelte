<script lang="ts">
  import { Body, Button, ButtonGroup, Input, Modal, ModalContent } from "@budibase/bbui"

  interface SharePointQuickSetupDetails {
    tenantId: string
    clientId: string
    clientSecret: string
  }

  export interface Props {
    creating?: boolean
    onCreate: (
      _details: SharePointQuickSetupDetails
    ) => Promise<void> | void
  }

  let { creating = false, onCreate }: Props = $props()

  let modal = $state<Modal>()
  let tenantId = $state("")
  let clientId = $state("")
  let clientSecret = $state("")
  let tenantIdError = $state<string | undefined>()
  let clientIdError = $state<string | undefined>()
  let clientSecretError = $state<string | undefined>()

  const resetErrors = () => {
    tenantIdError = undefined
    clientIdError = undefined
    clientSecretError = undefined
  }

  const validate = () => {
    resetErrors()
    const tenant = tenantId.trim()
    const client = clientId.trim()
    const secret = clientSecret.trim()

    if (!tenant) {
      tenantIdError = "Tenant ID is required"
    }
    if (!client) {
      clientIdError = "Client ID is required"
    }
    if (!secret) {
      clientSecretError = "Client secret is required"
    }

    return !!tenant && !!client && !!secret
  }

  export function show() {
    resetErrors()
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const handleCreate = async () => {
    if (creating || !validate()) {
      return
    }
    await onCreate({
      tenantId: tenantId.trim(),
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim(),
    })
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    custom
    showDivider={false}
    showConfirmButton={false}
    showCancelButton={false}
  >
    <div class="content">
      <div class="title">
        <Body size="S">Add from SharePoint</Body>
      </div>

      <Body size="XS" color="var(--spectrum-global-color-gray-700)">
        Enter your SharePoint app credentials to create a connection.
      </Body>

      <div class="form-fields">
        <Input
          label="Tenant ID"
          placeholder="GUID or domain"
          value={tenantId}
          on:change={e => {
            tenantId = e.detail
          }}
          on:blur={validate}
          error={tenantIdError}
          required
        />
        <Input
          label="Client ID"
          placeholder="Application (client) ID"
          value={clientId}
          on:change={e => {
            clientId = e.detail
          }}
          on:blur={validate}
          error={clientIdError}
          required
        />
        <Input
          label="Client secret"
          type="password"
          placeholder="Client secret"
          value={clientSecret}
          on:change={e => {
            clientSecret = e.detail
          }}
          on:blur={validate}
          error={clientSecretError}
          required
        />
      </div>
    </div>

    <ButtonGroup slot="footer">
      <Button cta primary on:click={handleCreate} disabled={creating}>
        {creating ? "Creating..." : "Create connection"}
      </Button>
    </ButtonGroup>
  </ModalContent>
</Modal>

<style>
  .content {
    padding: var(--spacing-l);
    width: min(460px, 95vw);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .title {
    padding-bottom: var(--spacing-xs);
  }

  .form-fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
</style>
