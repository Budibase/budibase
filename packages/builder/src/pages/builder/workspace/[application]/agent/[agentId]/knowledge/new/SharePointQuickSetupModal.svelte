<script lang="ts">
  import {
    Body,
    Button,
    ButtonGroup,
    Input,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import { z } from "zod"

  interface SharePointQuickSetupDetails {
    tenantId: string
    clientId: string
    clientSecret: string
  }

  interface SharePointQuickSetupFormData {
    tenantId: string
    clientId: string
    clientSecret: string
  }

  export interface Props {
    creating?: boolean
    onCreate: (_details: SharePointQuickSetupDetails) => Promise<void> | void
    onAdvancedSetup?: () => Promise<void> | void
  }

  let { creating = false, onCreate, onAdvancedSetup }: Props = $props()

  let modal = $state<Modal>()
  let tenantId = $state("")
  let clientId = $state("")
  let clientSecret = $state("")
  let errors = $state<Record<string, string>>({})
  let blurred = $state<Record<keyof SharePointQuickSetupFormData, boolean>>({
    tenantId: false,
    clientId: false,
    clientSecret: false,
  })

  const requiredString = (errorMessage: string) =>
    z
      .string({
        error: issue => (issue.input === undefined ? errorMessage : undefined),
      })
      .trim()
      .min(1, errorMessage)

  const validator = z.object({
    tenantId: requiredString("Tenant ID is required"),
    clientId: requiredString("Client ID is required"),
    clientSecret: requiredString("Client secret is required"),
  })

  const clearValidationState = () => {
    errors = {}
    blurred = {
      tenantId: false,
      clientId: false,
      clientSecret: false,
    }
  }

  const validate = () => {
    const validationResult = validator.safeParse({
      tenantId,
      clientId,
      clientSecret,
    })
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
    return validationResult
  }

  export function show() {
    clearValidationState()
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const handleCreate = async () => {
    if (creating) {
      return
    }

    blurred = {
      tenantId: true,
      clientId: true,
      clientSecret: true,
    }

    const result = validate()
    if (!result.success) {
      return
    }

    await onCreate(result.data)
  }

  const handleAdvancedSetup = async () => {
    if (creating) {
      return
    }

    await onAdvancedSetup?.()
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
            if (blurred.tenantId) {
              validate()
            }
          }}
          on:blur={() => {
            blurred.tenantId = true
            validate()
          }}
          error={blurred.tenantId ? errors.tenantId : undefined}
          required
        />
        <Input
          label="Client ID"
          placeholder="Application (client) ID"
          value={clientId}
          on:change={e => {
            clientId = e.detail
            if (blurred.clientId) {
              validate()
            }
          }}
          on:blur={() => {
            blurred.clientId = true
            validate()
          }}
          error={blurred.clientId ? errors.clientId : undefined}
          required
        />
        <Input
          label="Client secret"
          type="password"
          placeholder="Client secret"
          value={clientSecret}
          on:change={e => {
            clientSecret = e.detail
            if (blurred.clientSecret) {
              validate()
            }
          }}
          on:blur={() => {
            blurred.clientSecret = true
            validate()
          }}
          error={blurred.clientSecret ? errors.clientSecret : undefined}
          required
        />
      </div>
    </div>

    <ButtonGroup slot="footer">
      <Button cta secondary on:click={handleAdvancedSetup} disabled={creating}>
        Advanced setup
      </Button>
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
