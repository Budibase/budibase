<script lang="ts">
  import {
    Body,
    Helpers,
    Input,
    Label,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import type {
    AgentOperationApprovalPolicy,
    EscalationNotificationChannel,
    EscalationRecipient,
  } from "@budibase/types"
  import EscalationRecipients from "@/components/common/EscalationRecipients.svelte"

  export interface Props {
    agentId?: string
    providers?: EscalationNotificationChannel[]
    onSave: (policy: AgentOperationApprovalPolicy) => void | Promise<void>
    onClose?: () => void
  }

  let { agentId, providers = [], onSave, onClose }: Props = $props()

  let modal: Modal | undefined = $state()
  let editing = $state(false)
  let policyId = $state<string | undefined>()
  let name = $state("")
  let recipients = $state<EscalationRecipient[]>([])

  export const show = (policy?: AgentOperationApprovalPolicy) => {
    editing = !!policy
    policyId = policy?.id
    name = policy?.name ?? ""
    recipients = policy?.notifications?.recipients ?? []
    modal?.show()
  }

  export const hide = () => modal?.hide()

  const save = async () => {
    await onSave({
      id: policyId ?? Helpers.uuid(),
      name: name.trim(),
      notifications: { recipients },
    })
  }
</script>

<Modal bind:this={modal} on:hide={() => onClose?.()}>
  <ModalContent
    size="M"
    compact
    showCloseIcon={false}
    title={editing ? "Edit approval policy" : "Create approval policy"}
    confirmText={editing ? "Save policy" : "Create policy"}
    onConfirm={save}
    disabled={!name.trim() || !recipients.length}
  >
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">Name</Label>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          A recognisable name for this policy, shown on approval rules.
        </Body>
      </div>
      <Input bind:value={name} placeholder="e.g. Finance approval" />
    </div>
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">Notification</Label>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          Choose who gets notified when this policy requires approval.
        </Body>
      </div>
      {#if !providers.length}
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          There are currently no deployments configured on this agent, so no one
          can be notified. Add one in deployments first.
        </Body>
      {:else}
        <EscalationRecipients
          single
          {recipients}
          {agentId}
          {providers}
          onChange={updated => (recipients = updated as EscalationRecipient[])}
        />
      {/if}
    </div>
  </ModalContent>
</Modal>

<style>
  .configuration-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .field-copy {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>
