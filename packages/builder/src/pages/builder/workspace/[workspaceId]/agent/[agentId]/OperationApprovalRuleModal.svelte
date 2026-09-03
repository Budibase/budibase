<script lang="ts">
  import {
    Body,
    Button,
    Icon,
    Label,
    Modal,
    ModalContent,
    Select,
  } from "@budibase/bbui"
  import { FieldType } from "@budibase/types"
  import type {
    AgentOperationApprovalPolicy,
    ToolExecutionCondition,
    ToolExecutionRule,
  } from "@budibase/types"
  import { OperatorOptions, dataFilters } from "@budibase/shared-core"
  import { FilterField } from "@budibase/frontend-core"
  import type { ConditionField } from "./agentConditionFields"

  interface Props {
    onSave: (args: {
      rule: ToolExecutionRule
      index?: number
    }) => void | Promise<void>
    onRemove?: (index: number) => void
    onCreatePolicy?: (args: { index?: number; policyId?: string }) => void
    onOpenApiExplorer?: () => void
    onClose?: () => void
  }

  let { onSave, onRemove, onCreatePolicy, onOpenApiExplorer, onClose }: Props =
    $props()

  type ConditionDraft = ToolExecutionCondition & { noValue?: boolean }

  const NO_VALUE_OPERATORS = new Set<string>([
    OperatorOptions.Empty.value,
    OperatorOptions.NotEmpty.value,
  ])

  let modal: Modal | undefined = $state()
  let policies = $state<AgentOperationApprovalPolicy[]>([])
  let fields = $state<ConditionField[]>([])
  let editingIndex = $state<number | undefined>()
  let policyId = $state<string | undefined>()
  let conditions = $state<ConditionDraft[]>([])

  let apiExplorerAvailable = $state(false)

  export const show = (options: {
    policies: AgentOperationApprovalPolicy[]
    fields: ConditionField[]
    rule?: ToolExecutionRule
    index?: number
    apiExplorer?: boolean
  }) => {
    policies = options.policies
    fields = options.fields
    editingIndex = options.index
    policyId = options.rule?.policyId
    apiExplorerAvailable = options.apiExplorer ?? false
    conditions = (options.rule?.conditions ?? []).map(condition => ({
      ...condition,
      value:
        typeof condition.value === "boolean"
          ? String(condition.value)
          : condition.value,
      noValue: NO_VALUE_OPERATORS.has(condition.operator),
    }))
    modal?.show()
  }

  export const hide = () => modal?.hide()

  export const updateFields = (next: ConditionField[]) => {
    fields = next
  }

  const operatorsFor = (condition: ConditionDraft) => {
    const field = fields.find(candidate => candidate.name === condition.field)
    return dataFilters.getValidOperatorsForType({
      type: condition.type ?? FieldType.STRING,
      constraints: field?.constraints,
    })
  }

  const addCondition = () => {
    const field = fields[0]
    if (!field) {
      return
    }
    const operators = dataFilters.getValidOperatorsForType({
      type: field.type,
      constraints: field.constraints,
    })
    conditions = [
      ...conditions,
      {
        field: field.name,
        type: field.type,
        operator: operators[0]?.value as ToolExecutionCondition["operator"],
        value: undefined,
      },
    ]
  }

  const removeCondition = (index: number) => {
    conditions = conditions.filter((_, i) => i !== index)
  }

  const changeConditionField = (index: number, name: string | undefined) => {
    const field = fields.find(candidate => candidate.name === name)
    if (!field) {
      return
    }
    const condition = conditions[index]
    const operators = dataFilters.getValidOperatorsForType({
      type: field.type,
      constraints: field.constraints,
    })
    const operatorStillValid = operators.some(
      option => option.value === condition.operator
    )
    const operator = operatorStillValid
      ? condition.operator
      : (operators[0]?.value as ToolExecutionCondition["operator"])
    conditions[index] = {
      ...condition,
      field: field.name,
      type: field.type,
      operator,
      noValue: NO_VALUE_OPERATORS.has(operator),
      value: undefined,
    }
  }

  const changeConditionOperator = (
    index: number,
    operator: ToolExecutionCondition["operator"]
  ) => {
    const noValue = NO_VALUE_OPERATORS.has(operator)
    conditions[index] = {
      ...conditions[index],
      operator,
      noValue,
      value: noValue ? undefined : conditions[index].value,
    }
  }

  const changeConditionValue = (index: number, value: unknown) => {
    conditions[index] = { ...conditions[index], value }
  }

  const coerceValue = (condition: ConditionDraft) => {
    const { value, type } = condition
    if (typeof value !== "string") {
      return value
    }
    if (type === FieldType.NUMBER || type === FieldType.BIGINT) {
      const parsed = parseFloat(value)
      return isNaN(parsed) ? value : parsed
    }
    if (type === FieldType.BOOLEAN) {
      return value === "true"
    }
    return value
  }

  const conditionsComplete = $derived(
    conditions.every(
      condition =>
        condition.noValue ||
        (condition.value !== undefined && condition.value !== "")
    )
  )

  const save = async () => {
    if (!policyId) {
      return
    }
    const cleaned = conditions.map(({ noValue: _noValue, ...condition }) => ({
      ...condition,
      value: coerceValue(condition),
    }))
    await onSave({
      rule: {
        policyId,
        ...(cleaned.length ? { conditions: cleaned } : {}),
      },
      index: editingIndex,
    })
  }

  const remove = () => {
    if (editingIndex !== undefined) {
      onRemove?.(editingIndex)
    }
  }
</script>

<Modal bind:this={modal} on:hide={() => onClose?.()}>
  <ModalContent
    size="L"
    compact
    showCloseIcon={false}
    confirmText={editingIndex !== undefined ? "Save rule" : "Add rule"}
    showSecondaryButton={editingIndex !== undefined && !!onRemove}
    secondaryButtonText="Remove rule"
    secondaryButtonWarning
    secondaryAction={remove}
    onConfirm={save}
    disabled={!policyId || !conditionsComplete}
  >
    <div slot="header" class="modal-header">
      <span>
        {editingIndex !== undefined
          ? "Edit approval rule"
          : "Add approval rule"}
      </span>
      {#if apiExplorerAvailable}
        <Button secondary size="S" on:click={() => onOpenApiExplorer?.()}>
          Open API explorer
        </Button>
      {/if}
    </div>
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">Conditions</Label>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          Approval is required when all conditions are met. Without conditions,
          this rule always applies.
        </Body>
      </div>
      {#if !fields.length}
        <Body size="XS" color="var(--spectrum-global-color-gray-600)">
          This tool has no fields that conditions can check, so this rule always
          applies.
        </Body>
      {:else}
        {#if conditions.length}
          <div class="conditions-list">
            {#each conditions as condition, index}
              <div class="condition-row">
                <Select
                  size="M"
                  value={condition.field}
                  options={fields}
                  placeholder={false}
                  getOptionLabel={field => field.label}
                  getOptionValue={field => field.name}
                  on:change={event => changeConditionField(index, event.detail)}
                />
                <Select
                  size="M"
                  value={condition.operator}
                  options={operatorsFor(condition)}
                  placeholder={false}
                  getOptionLabel={option => option.label}
                  getOptionValue={option => option.value}
                  on:change={event =>
                    changeConditionOperator(index, event.detail)}
                />
                <FilterField
                  filter={condition}
                  schemaFields={fields}
                  useConditionValueControls
                  on:change={event =>
                    changeConditionValue(index, event.detail.value)}
                />
                <button
                  class="condition-remove"
                  aria-label="Remove condition"
                  onclick={() => removeCondition(index)}
                >
                  <Icon name="x" size="XS" />
                </button>
              </div>
            {/each}
          </div>
        {:else}
          <div class="conditions-placeholder">
            <Body size="XS" color="var(--spectrum-global-color-gray-600)">
              Always applies
            </Body>
          </div>
        {/if}
        <div>
          <Button secondary size="S" icon="plus-circle" on:click={addCondition}>
            Add condition
          </Button>
        </div>
      {/if}
    </div>
    <div class="configuration-field">
      <div class="field-copy">
        <Label size="M">Approval policy</Label>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          The policy that decides who approves and how they are notified.
        </Body>
      </div>
      <Select
        size="M"
        bind:value={policyId}
        options={policies}
        placeholder="Select a policy"
        getOptionLabel={policy => policy.name}
        getOptionValue={policy => policy.id}
      />
      <div>
        <Button
          secondary
          size="S"
          icon="plus-circle"
          on:click={() => onCreatePolicy?.({ index: editingIndex, policyId })}
        >
          Create new policy
        </Button>
      </div>
    </div>
  </ModalContent>
</Modal>

<style>
  .modal-header {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .conditions-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-l) var(--spacing-m);
    border: 1px dashed var(--spectrum-global-color-gray-400);
    border-radius: 4px;
  }

  .conditions-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .condition-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    align-items: center;
    gap: var(--spacing-s);
  }

  .condition-row > :global(*) {
    min-width: 0;
  }

  .condition-remove {
    display: flex;
    padding: 4px;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
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
