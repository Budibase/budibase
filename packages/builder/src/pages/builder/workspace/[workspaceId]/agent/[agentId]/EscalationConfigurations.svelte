<script lang="ts">
  import { ActionButton, Body, Button, Helpers, Input } from "@budibase/bbui"
  import type {
    AgentOperation,
    AgentOperationApprovalPolicy,
    AgentOperationToolConfig,
    EscalationRecipient,
  } from "@budibase/types"
  import EscalationRecipients from "@/components/common/EscalationRecipients.svelte"
  import type { AgentTool } from "./toolTypes"

  let {
    operation = $bindable(),
    agentId,
    availableTools = [],
    onUpdated,
  }: {
    operation: AgentOperation
    agentId?: string
    availableTools?: AgentTool[]
    onUpdated: () => Promise<boolean>
  } = $props()

  let adding = $state(false)
  let pendingName = $state("")
  let pendingRecipients = $state<EscalationRecipient[]>([])
  let recipientEditorOpen = $state(false)

  const normalizeName = (name: string) => name.trim().toLowerCase()
  const nameExists = (name: string, exceptId?: string) =>
    (operation.approvalPolicies || []).some(
      policy =>
        policy.id !== exceptId &&
        normalizeName(policy.name) === normalizeName(name)
    )

  const updatePolicy = (
    id: string,
    update: Partial<AgentOperationApprovalPolicy>
  ) => {
    operation.approvalPolicies = (operation.approvalPolicies || []).map(
      policy => (policy.id === id ? { ...policy, ...update } : policy)
    )
    onUpdated()
  }

  const updatePolicyName = (
    policy: AgentOperationApprovalPolicy,
    name: string
  ) => {
    const trimmed = name.trim()
    if (!trimmed || nameExists(trimmed, policy.id)) {
      return
    }
    updatePolicy(policy.id, { name: trimmed })
  }

  const formatFallbackToolName = (toolName: string) => {
    const action = toolName.match(
      /(create_row|update_row|delete_row|get_row|list_rows|get_table|list_tables)$/
    )?.[1]
    return (action || toolName)
      .split("_")
      .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(" ")
  }

  const formatToolName = (toolConfig: AgentOperationToolConfig) => {
    const tool = availableTools.find(
      candidate => candidate.runtimeBinding === toolConfig.toolName
    )
    const displayName = tool?.readableName || tool?.name
    if (!tool || !displayName) {
      return formatFallbackToolName(toolConfig.toolName)
    }
    if (tool.sourceLabel && !displayName.startsWith(`${tool.sourceLabel}.`)) {
      return `${tool.sourceLabel}: ${displayName}`
    }
    return displayName
  }

  const referencesFor = (id: string) =>
    (operation.enabledTools || [])
      .filter(tool => tool.approvalPolicyId === id)
      .map(formatToolName)

  const addPolicy = () => {
    const name = pendingName.trim()
    if (!name || !pendingRecipients.length || nameExists(name)) {
      return
    }
    operation.approvalPolicies = [
      ...(operation.approvalPolicies || []),
      {
        id: `approval_policy_${Helpers.uuid()}`,
        name,
        recipients: pendingRecipients,
      },
    ]
    pendingName = ""
    pendingRecipients = []
    recipientEditorOpen = false
    adding = false
    onUpdated()
  }

  const deletePolicy = (id: string) => {
    if (referencesFor(id).length) {
      return
    }
    operation.approvalPolicies = (operation.approvalPolicies || []).filter(
      policy => policy.id !== id
    )
    onUpdated()
  }
</script>

<section class="approval-policies">
  <div class="configurations-header">
    <div class="section-header">
      <Body size="XS" color="var(--spectrum-global-color-gray-900)"
        >Approval policies</Body
      >
      <Body size="XS" color="var(--spectrum-global-color-gray-700)">
        Create reusable approval destinations for this operation's tools.
      </Body>
    </div>
    {#if !adding}
      <Button secondary size="S" icon="plus" on:click={() => (adding = true)}>
        Add policy
      </Button>
    {/if}
  </div>

  {#each operation.approvalPolicies || [] as policy (policy.id)}
    {@const references = referencesFor(policy.id)}
    <div class="configuration">
      <div class="configuration-main">
        <div class="configuration-fields">
          <Input
            label="Name"
            value={policy.name}
            error={!policy.name.trim()
              ? "Name is required"
              : nameExists(policy.name, policy.id)
                ? "Name must be unique"
                : undefined}
            on:change={event => updatePolicyName(policy, event.detail)}
          />
          <div class="destination-field">
            <Body size="XS" color="var(--spectrum-global-color-gray-800)"
              >Recipients</Body
            >
            <EscalationRecipients
              recipients={policy.recipients}
              minimumRecipients={1}
              {agentId}
              onChange={recipients => {
                if (recipients.length) {
                  updatePolicy(policy.id, { recipients })
                }
              }}
            />
          </div>
        </div>
        {#if references.length}
          <Body size="XS" color="var(--spectrum-global-color-gray-700)">
            Used by {references.join(", ")}
          </Body>
        {/if}
      </div>
      <ActionButton
        icon="Delete"
        disabled={references.length > 0}
        tooltip={references.length > 0
          ? "Remove tool references before deleting"
          : "Delete policy"}
        on:click={() => deletePolicy(policy.id)}
      />
    </div>
  {/each}

  {#if adding}
    <div class="configuration add-configuration">
      <Input
        label="Name"
        placeholder="Engineering"
        bind:value={pendingName}
        error={nameExists(pendingName) ? "Name must be unique" : undefined}
      />
      <EscalationRecipients
        recipients={pendingRecipients}
        {agentId}
        onChange={recipients => (pendingRecipients = recipients)}
        onAddingChange={adding => (recipientEditorOpen = adding)}
      />
      {#if !recipientEditorOpen}
        <div class="add-actions">
          {#if pendingRecipients.length}
            <Button
              cta
              disabled={!pendingName.trim() || nameExists(pendingName)}
              on:click={addPolicy}>Create</Button
            >
          {/if}
          <Button
            secondary
            on:click={() => {
              adding = false
              pendingName = ""
              pendingRecipients = []
              recipientEditorOpen = false
            }}>Cancel</Button
          >
        </div>
      {/if}
    </div>
  {/if}
</section>

<style>
  .approval-policies {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin: var(--spacing-xl) 0;
  }
  .configurations-header,
  .configuration-fields,
  .add-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .configurations-header {
    justify-content: space-between;
    gap: var(--spacing-l);
  }
  .section-header {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-width: 600px;
  }
  .section-header > :global(.spectrum-Body):first-child {
    font-weight: 500;
  }
  .configuration {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-m);
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
  }
  .configuration-fields {
    flex: 1;
    min-width: 0;
  }
  .configuration-main,
  .destination-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
  .configuration-main {
    flex: 1;
    min-width: 0;
  }
  .destination-field {
    flex: 1;
  }
  .configuration-fields :global(.recipients) {
    flex: 1;
  }
  .add-configuration {
    align-items: flex-end;
  }
</style>
