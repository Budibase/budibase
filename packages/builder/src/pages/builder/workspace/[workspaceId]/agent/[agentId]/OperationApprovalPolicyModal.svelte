<script lang="ts">
  import {
    Body,
    Helpers,
    Input,
    keepOpen,
    Label,
    Modal,
    ModalContent,
    Select,
  } from "@budibase/bbui"
  import { FilterUsers } from "@budibase/frontend-core"
  import { ResolutionStrategy } from "@budibase/types"
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
    onRemove?: (
      policy: AgentOperationApprovalPolicy
    ) => boolean | Promise<boolean>
    onClose?: () => void
  }

  let { agentId, providers = [], onSave, onRemove, onClose }: Props = $props()

  const ANY = "any"
  type ApprovalTypeValue = ResolutionStrategy | typeof ANY

  const approvalTypeOptions: {
    value: ApprovalTypeValue
    label: string
    subtitle: string
  }[] = [
    {
      value: ANY,
      label: "Any approver",
      subtitle: "Approval from any one approver is enough to proceed.",
    },
    {
      value: ResolutionStrategy.UNANIMOUS,
      label: "Unanimous",
      subtitle: "Every approver must approve before it can proceed.",
    },
    {
      value: ResolutionStrategy.MAJORITY,
      label: "Majority",
      subtitle: "More than half of the approvers must approve to proceed.",
    },
  ]

  let modal: Modal | undefined = $state()
  let editing = $state(false)
  let existing = $state<AgentOperationApprovalPolicy | undefined>()
  let name = $state("")
  let recipients = $state<EscalationRecipient[]>([])
  let approvers = $state<string[]>([])
  let approvalType = $state<ApprovalTypeValue>(ANY)

  export const show = (policy?: AgentOperationApprovalPolicy) => {
    editing = !!policy
    existing = policy
    name = policy?.name ?? ""
    recipients = policy?.notifications?.recipients ?? []
    approvers = policy?.approvers ?? []
    approvalType =
      policy?.approvalType &&
      policy.approvalType !== ResolutionStrategy.FIRST_RESPONSE
        ? policy.approvalType
        : ANY
    modal?.show()
  }

  export const hide = () => modal?.hide()

  const changeApprovers = (updated: string[]) => {
    approvers = updated
    if (approvers.length <= 1) {
      approvalType = ANY
    }
  }

  const save = async () => {
    const policy: AgentOperationApprovalPolicy = {
      ...existing,
      id: existing?.id ?? Helpers.uuid(),
      name: name.trim(),
      approvers,
      notifications: { ...existing?.notifications, recipients },
    }
    if (approvalType === ANY) {
      delete policy.approvalType
    } else {
      policy.approvalType = approvalType
    }
    await onSave(policy)
  }

  const remove = async () => {
    if (!existing || !(await onRemove?.(existing))) {
      return keepOpen
    }
  }
</script>

<Modal bind:this={modal} on:hide={() => onClose?.()}>
  <ModalContent
    size="M"
    compact
    showCloseIcon={false}
    title={editing ? "Edit approval policy" : "Create approval policy"}
    confirmText={editing ? "Save policy" : "Create policy"}
    showSecondaryButton={editing && !!onRemove}
    secondaryButtonText="Delete"
    secondaryButtonWarning
    secondaryAction={remove}
    onConfirm={save}
    disabled={!name.trim() || !recipients.length}
  >
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">Policy name</Label>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          Give your approval policy a name.
        </Body>
      </div>
      <Input bind:value={name} placeholder="e.g. Finance approval" />
    </div>
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">Approval type</Label>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          How many approvers must respond before it can proceed.
        </Body>
      </div>
      <Select
        size="M"
        placeholder={false}
        options={approvalTypeOptions}
        value={approvalType}
        getOptionLabel={option => option.label}
        getOptionValue={option => option.value}
        getOptionSubtitle={option => option.subtitle}
        showSelectedSubtitle
        disabled={approvers.length <= 1}
        on:change={event => (approvalType = event.detail)}
      />
    </div>
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">Approvers</Label>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          Who reviews and responds to the escalated request
        </Body>
      </div>
      <FilterUsers
        multiselect
        value={approvers}
        on:change={event => changeApprovers(event.detail ?? [])}
      />
    </div>
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">Notification</Label>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          Where escalations appear
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
