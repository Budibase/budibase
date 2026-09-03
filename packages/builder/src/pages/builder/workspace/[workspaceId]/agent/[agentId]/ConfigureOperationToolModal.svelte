<script lang="ts">
  import {
    Body,
    Button,
    Heading,
    Icon,
    Label,
    Modal,
    ModalContent,
    Select,
  } from "@budibase/bbui"
  import { FeatureFlag, ToolExecutionPrincipal } from "@budibase/types"
  import type {
    AgentOperationApprovalPolicy,
    ToolExecutionRule,
  } from "@budibase/types"
  import { featureFlags } from "@/stores/portal"
  import ToolIcon from "./ToolIcon.svelte"
  import { describeConditions } from "./agentConditionFields"
  import type { AgentTool } from "./toolTypes"

  interface Props {
    onSave: (args: {
      tool: AgentTool
      executionPrincipal: ToolExecutionPrincipal
      executionRules?: ToolExecutionRule[]
    }) => void | Promise<void>
    onRemove: (tool: AgentTool) => void
    onEditRule?: (args: {
      tool: AgentTool
      executionPrincipal: ToolExecutionPrincipal
      rules: ToolExecutionRule[]
      index?: number
    }) => void
    onClose?: () => void
  }

  let { onSave, onRemove, onEditRule, onClose }: Props = $props()

  let modal: Modal | undefined = $state()
  let tool = $state<AgentTool | undefined>()
  let principalConfigurable = $state(false)
  let adding = $state(false)
  let executionPrincipal = $state(ToolExecutionPrincipal.REQUESTER)
  let approvalsConfigurable = $state(false)
  let rules = $state<ToolExecutionRule[]>([])
  let policies = $state<AgentOperationApprovalPolicy[]>([])

  const options = [
    { label: "Requester", value: ToolExecutionPrincipal.REQUESTER },
    { label: "Admin (elevated)", value: ToolExecutionPrincipal.ADMIN },
  ]

  export const show = (
    selectedTool: AgentTool,
    principal: ToolExecutionPrincipal,
    canConfigurePrincipal: boolean,
    isAdding = false,
    approvals?: {
      enabled: boolean
      rules: ToolExecutionRule[]
      policies: AgentOperationApprovalPolicy[]
    }
  ) => {
    tool = selectedTool
    executionPrincipal = principal
    principalConfigurable = canConfigurePrincipal
    adding = isAdding
    approvalsConfigurable = approvals?.enabled ?? false
    rules = approvals?.rules ?? []
    policies = approvals?.policies ?? []
    modal?.show()
  }

  export const hide = () => modal?.hide()

  const policyName = (policyId: string) =>
    policies.find(policy => policy.id === policyId)?.name ?? "Missing policy"

  const editRule = (index?: number) => {
    if (tool) {
      onEditRule?.({ tool, executionPrincipal, rules, index })
    }
  }

  const save = async () => {
    if (tool) {
      await onSave({
        tool,
        executionPrincipal,
        executionRules: approvalsConfigurable ? rules : undefined,
      })
    }
  }

  const remove = () => {
    if (tool) {
      onRemove(tool)
    }
  }
</script>

<Modal bind:this={modal} on:hide={() => onClose?.()}>
  <ModalContent
    size="M"
    compact
    confirmText={adding ? "Add tool" : "Save tool"}
    showConfirmButton={adding || principalConfigurable || approvalsConfigurable}
    showSecondaryButton={!adding}
    secondaryButtonText="Remove tool"
    secondaryButtonWarning
    secondaryAction={remove}
    onConfirm={save}
    showCloseIcon={false}
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
      {#if approvalsConfigurable}
        <div class="configuration-field">
          <div class="field-copy">
            <Label size="M">Approval rules</Label>
            <Body size="XS" color="var(--spectrum-global-color-gray-700)">
              Choose the policy to apply when these conditions are met.
            </Body>
          </div>
          {#if rules.length}
            <div class="rules-list">
              {#each rules as rule, index}
                <button
                  class="rule-row"
                  title={`${describeConditions(rule.conditions)}\nUse policy: ${policyName(rule.policyId)}`}
                  onclick={() => editRule(index)}
                >
                  <span class="rule-summary">
                    <span class="rule-condition">
                      {describeConditions(rule.conditions)}
                    </span>
                    <span class="rule-policy">
                      Use policy: {policyName(rule.policyId)}
                    </span>
                  </span>
                  <Icon name="chevron-right" size="XS" />
                </button>
              {/each}
            </div>
          {/if}
          <div>
            <Button
              secondary
              size="S"
              icon="plus-circle"
              on:click={() => editRule()}
            >
              Add approval rule
            </Button>
          </div>
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
    min-width: 0;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .field-copy {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .rules-list {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .rule-row {
    display: flex;
    min-width: 0;
    max-width: 100%;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-s) var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    background: transparent;
    color: var(--spectrum-global-color-gray-900);
    cursor: pointer;
    text-align: left;
  }

  .rule-row:hover {
    background: var(--spectrum-global-color-gray-100);
  }

  .rule-summary {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  .rule-condition {
    display: block;
    max-width: 100%;
    color: var(--color-green-500);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rule-policy {
    display: block;
    max-width: 100%;
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
