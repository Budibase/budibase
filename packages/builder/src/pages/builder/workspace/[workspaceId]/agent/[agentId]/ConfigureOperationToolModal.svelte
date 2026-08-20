<script lang="ts">
  import {
    Body,
    Heading,
    Label,
    Modal,
    ModalContent,
    Select,
  } from "@budibase/bbui"
  import { FeatureFlag, ToolExecutionPrincipal } from "@budibase/types"
  import type {
    EscalationNotificationChannel,
    EscalationRecipient,
  } from "@budibase/types"
  import { featureFlags } from "@/stores/portal"
  import EscalationRecipients from "@/components/common/EscalationRecipients.svelte"
  import ToolIcon from "./ToolIcon.svelte"
  import type { AgentTool } from "./toolTypes"

  export let agentId: string | undefined = undefined
  export let providers: EscalationNotificationChannel[] = []
  export let onSave: (args: {
    tool: AgentTool
    executionPrincipal: ToolExecutionPrincipal
    recipients?: EscalationRecipient[]
  }) => void
  export let onRemove: (tool: AgentTool) => void

  let modal: Modal
  let tool: AgentTool | undefined
  let principalConfigurable = false
  let adding = false
  let executionPrincipal = ToolExecutionPrincipal.REQUESTER
  let escalationConfigurable = false
  let recipients: EscalationRecipient[] = []

  const options = [
    { label: "Requester", value: ToolExecutionPrincipal.REQUESTER },
    { label: "Admin (elevated)", value: ToolExecutionPrincipal.ADMIN },
  ]

  export const show = (
    selectedTool: AgentTool,
    principal: ToolExecutionPrincipal,
    canConfigurePrincipal: boolean,
    isAdding = false,
    escalation?: { enabled: boolean; recipients: EscalationRecipient[] }
  ) => {
    tool = selectedTool
    executionPrincipal = principal
    principalConfigurable = canConfigurePrincipal
    adding = isAdding
    escalationConfigurable = escalation?.enabled ?? false
    recipients = escalation?.recipients ?? []
    modal.show()
  }

  const save = () => {
    if (tool) {
      onSave({
        tool,
        executionPrincipal,
        recipients: escalationConfigurable ? recipients : undefined,
      })
    }
  }

  const remove = () => {
    if (tool) {
      onRemove(tool)
    }
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    size="M"
    confirmText="Save tool"
    showSecondaryButton={!adding}
    secondaryButtonText="Remove tool"
    secondaryButtonWarning
    secondaryAction={remove}
    onConfirm={save}
  >
    <div slot="header" class="modal-title">
      {#if tool}
        <ToolIcon icon={tool.icon} size="S" fallbackIcon="Wrench" />

        <Heading size="S">
          {adding ? "Add" : "Configure"}
          {tool.readableBinding}
        </Heading>
      {/if}
    </div>

    {#if tool}
      {#if $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY]}
        <div class="configuration-field">
          <div class="field-copy">
            <Label size="M">Run as</Label>
            <Body size="XS" color="var(--spectrum-global-color-gray-700)">
              Choose the role used to access data and perform this action.
            </Body>
          </div>
          <Select
            size="M"
            bind:value={executionPrincipal}
            placeholder={false}
            {options}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            disabled={!principalConfigurable}
          />
        </div>
      {/if}
      {#if escalationConfigurable}
        <div class="configuration-field">
          <div class="field-copy">
            <Label size="M">Escalation</Label>
            <Body size="XS" color="var(--spectrum-global-color-gray-700)">
              Require human approval before this tool runs. Choose who gets
              notified.
            </Body>
          </div>
          {#if !providers.length}
            <Body size="XS" color="var(--spectrum-global-color-gray-700)">
              There are currently no deployments configured on this agent, so no
              one can be notified. Add one in deployments first.
            </Body>
          {:else}
            <EscalationRecipients
              single
              {recipients}
              {agentId}
              {providers}
              onChange={updated =>
                (recipients = updated as EscalationRecipient[])}
            />
          {/if}
        </div>
      {/if}
    {/if}
  </ModalContent>
</Modal>

<style>
  .modal-title {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: var(--spacing-s);
  }

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
