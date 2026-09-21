<script lang="ts">
  import {
    Body,
    Helpers,
    Icon,
    Input,
    keepOpen,
    Label,
    Link,
    Modal,
    ModalContent,
    Select,
  } from "@budibase/bbui"
  import { FilterUsers } from "@budibase/frontend-core"
  import { ESCALATION_DURATION_PRESETS } from "@budibase/shared-core"
  import { EscalationAction, ResolutionStrategy } from "@budibase/types"
  import type {
    AgentOperationApprovalPolicy,
    EscalationNotificationChannel,
    EscalationRecipient,
  } from "@budibase/types"
  import EscalationRecipients from "@/components/common/EscalationRecipients.svelte"
  import { licensing } from "@/stores/portal"

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

  const NEVER = "never"
  const CUSTOM = "custom"
  const EXPIRE = "expire"
  const HOUR_SECONDS = 60 * 60
  const DAY_SECONDS = 24 * HOUR_SECONDS
  const WEEK_SECONDS = 7 * DAY_SECONDS
  type ExpiryValue = number | typeof NEVER | typeof CUSTOM
  type OutcomeValue = EscalationAction | typeof EXPIRE

  const durationUnits: { value: number; label: string }[] = [
    { value: HOUR_SECONDS, label: "Hours" },
    { value: DAY_SECONDS, label: "Days" },
    { value: WEEK_SECONDS, label: "Weeks" },
  ]

  const durationPresets: { value: number; label: string }[] = [
    { value: ESCALATION_DURATION_PRESETS.ONE_DAY, label: "1 day" },
    { value: ESCALATION_DURATION_PRESETS.THREE_DAYS, label: "3 days" },
    { value: ESCALATION_DURATION_PRESETS.ONE_WEEK, label: "1 week" },
    { value: ESCALATION_DURATION_PRESETS.THIRTY_DAYS, label: "30 days" },
    { value: ESCALATION_DURATION_PRESETS.NINETY_DAYS, label: "90 days" },
  ]

  const outcomeOptions: { value: OutcomeValue; label: string }[] = [
    { value: EXPIRE, label: "Expire" },
    { value: EscalationAction.REJECT, label: "Reject request" },
    { value: EscalationAction.APPROVE, label: "Approve request" },
  ]

  let modal: Modal | undefined = $state()
  let editing = $state(false)
  let existing = $state<AgentOperationApprovalPolicy | undefined>()
  let name = $state("")
  let recipients = $state<EscalationRecipient[]>([])
  let approvers = $state<string[]>([])
  let approvalType = $state<ApprovalTypeValue>(ANY)
  let expiry = $state<ExpiryValue>(ESCALATION_DURATION_PRESETS.ONE_DAY)
  let customValue = $state<number | undefined>()
  let customUnit = $state(DAY_SECONDS)
  let outcome = $state<OutcomeValue>(EXPIRE)
  let cappedFrom = $state<string | undefined>()
  let cappedTo = $state("")

  let customValid = $derived(
    Number.isInteger(customValue) && (customValue ?? 0) >= 1
  )

  let ceilingDays = $derived(
    $licensing.license?.quotas?.constant?.escalationDurationDays?.value
  )
  let unlimited = $derived(!ceilingDays || ceilingDays <= 0)
  let allowedPresets = $derived(
    unlimited
      ? durationPresets
      : durationPresets.filter(
          preset => preset.value <= (ceilingDays ?? 0) * DAY_SECONDS
        )
  )
  let expiryOptions = $derived<{ value: ExpiryValue; label: string }[]>(
    unlimited
      ? [
          ...allowedPresets,
          { value: NEVER, label: "Never expires" },
          { value: CUSTOM, label: "Custom" },
        ]
      : allowedPresets
  )

  const splitDuration = (seconds: number) => {
    const unit =
      [...durationUnits].reverse().find(unit => seconds % unit.value === 0) ??
      durationUnits[0]
    return { value: Math.max(1, Math.round(seconds / unit.value)), unit }
  }

  const deriveExpiry = (policy?: AgentOperationApprovalPolicy): ExpiryValue => {
    const largest = allowedPresets[allowedPresets.length - 1].value
    if (policy?.expiry?.never) {
      return unlimited ? NEVER : largest
    }
    const duration =
      policy?.expiry?.duration ?? ESCALATION_DURATION_PRESETS.ONE_DAY
    if (allowedPresets.some(preset => preset.value === duration)) {
      return duration
    }
    if (unlimited) {
      return CUSTOM
    }
    const atOrBelow = allowedPresets.filter(preset => preset.value <= duration)
    return atOrBelow.length
      ? atOrBelow[atOrBelow.length - 1].value
      : allowedPresets[0].value
  }

  const expiryLabel = (value: ExpiryValue) => {
    if (value === NEVER) {
      return "Never expires"
    }
    if (value === CUSTOM) {
      return "Custom"
    }
    const preset = durationPresets.find(preset => preset.value === value)
    if (preset) {
      return preset.label
    }
    const { value: count, unit } = splitDuration(value)
    const label = count === 1 ? unit.label.slice(0, -1) : unit.label
    return `${count} ${label.toLowerCase()}`
  }

  const storedExpiry = (
    policy?: AgentOperationApprovalPolicy
  ): ExpiryValue | undefined => {
    if (policy?.expiry?.never) {
      return NEVER
    }
    return policy?.expiry?.duration
  }

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
    expiry = deriveExpiry(policy)
    outcome = policy?.expiry?.outcome ?? EXPIRE
    const stored = storedExpiry(policy)
    if (expiry === CUSTOM && typeof stored === "number") {
      const split = splitDuration(stored)
      customValue = split.value
      customUnit = split.unit.value
    } else {
      customValue = undefined
      customUnit = DAY_SECONDS
    }
    const capped =
      stored !== undefined && expiry !== CUSTOM && stored !== expiry
    cappedFrom = capped ? expiryLabel(stored) : undefined
    cappedTo = expiryLabel(expiry)
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
    if (expiry === NEVER) {
      policy.expiry = { never: true }
    } else {
      const duration =
        expiry === CUSTOM ? (customValue ?? 0) * customUnit : expiry
      policy.expiry = { duration }
      if (outcome !== EXPIRE) {
        policy.expiry.outcome = outcome
      }
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
    disabled={!name.trim() ||
      !recipients.length ||
      (expiry === CUSTOM && !customValid)}
  >
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">Policy name</Label>
      </div>
      <Input bind:value={name} placeholder="e.g. Finance approval" />
    </div>
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">Approval type</Label>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          Choose how approval is decided when there are multiple approvers.
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
          Choose who can approve requests using this policy.
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
          Choose where approvers are notified.
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
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">Approval expiration</Label>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          How long approvers have to respond before the approval expires.
        </Body>
      </div>
      <Select
        size="M"
        placeholder={false}
        options={expiryOptions}
        value={expiry}
        getOptionLabel={option => option.label}
        getOptionValue={option => option.value}
        on:change={event => (expiry = event.detail)}
      />
      {#if expiry === CUSTOM}
        <div class="custom-duration">
          <div class="custom-duration-fields">
            <Input type="number" bind:value={customValue} placeholder="45" />
            <Select
              size="M"
              placeholder={false}
              options={durationUnits}
              value={customUnit}
              getOptionLabel={option => option.label}
              getOptionValue={option => option.value}
              on:change={event => (customUnit = event.detail)}
            />
          </div>
        </div>
      {/if}
      {#if cappedFrom}
        <div class="capped">
          <Icon name="warning" size="M" />
          <div class="capped-copy">
            <Label size="M">Capped at {cappedTo} on your current plan</Label>
            <Body size="XS" color="var(--spectrum-global-color-gray-700)">
              This policy remains set to {cappedFrom}, but new approvals will
              expire after {cappedTo}. Existing approvals keep their original
              expiry.
            </Body>
            <Link size="S" on:click={() => licensing.goToPricingPage()}>
              Compare plans
            </Link>
          </div>
        </div>
      {/if}
    </div>
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">What happens on expiry</Label>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          Choose what happens if the approval expires before a response.
        </Body>
      </div>
      <Select
        size="M"
        placeholder={false}
        options={outcomeOptions}
        value={outcome}
        getOptionLabel={option => option.label}
        getOptionValue={option => option.value}
        disabled={expiry === NEVER}
        on:change={event => (outcome = event.detail)}
      />
      {#if expiry === NEVER}
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          Requests that never expire stay open until an approver responds.
        </Body>
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

  .capped {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-m);
    padding: var(--spacing-m);
    background: var(--spectrum-global-color-gray-75);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    color: var(--spectrum-global-color-gray-700);
  }

  .capped-copy {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    align-items: flex-start;
  }

  .custom-duration {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    padding: var(--spacing-m);
    background: var(--spectrum-global-color-gray-75);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
  }

  .custom-duration-fields {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--spacing-m);
  }
</style>
