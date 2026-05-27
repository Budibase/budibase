<script lang="ts">
  import { Body } from "@budibase/bbui"
  import { SvelteSet } from "svelte/reactivity"
  import type { ValidationConstraintOption } from "./constraints"
  import ValidationRuleCard from "./ValidationRuleCard.svelte"
  import type { SchemaValidationRule } from "./types"

  export let constraintOptions: ValidationConstraintOption[] = []
  export let rules: SchemaValidationRule[] = []

  let expanded = new SvelteSet<string>()

  const getRuleId = (rule: SchemaValidationRule, index: number): string =>
    `${rule.constraint}-${index}`

  const toggle = (id: string): void => {
    if (expanded.has(id)) {
      expanded.delete(id)
    } else {
      expanded.add(id)
    }
  }

  const constraintLabel = (constraint?: string): string => {
    const option = constraintOptions.find(option => option.value === constraint)
    return option?.label || constraint || "Validation rule"
  }

  const valueSummary = (value: unknown): string => {
    if (value == null || value === "") {
      return ""
    }
    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : ""
    }
    return String(value)
  }
</script>

{#if rules?.length}
  <div class="schema-rules">
    {#each rules as rule, index}
      {@const id = getRuleId(rule, index)}
      {@const isExpanded = expanded.has(id)}
      {@const summary = valueSummary(rule.value)}
      <ValidationRuleCard
        title={constraintLabel(rule.constraint)}
        {summary}
        error={rule.error}
        expanded={isExpanded}
        onToggle={() => toggle(id)}
      >
        <div class="schema-details" class:schema-details--no-value={!summary}>
          <div class="detail">
            <div class="detail__label">Constraint</div>
            <div class="detail__value">
              {constraintLabel(rule.constraint)}
            </div>
          </div>
          {#if summary}
            <div class="detail">
              <div class="detail__label">Value</div>
              <div class="detail__value">{summary}</div>
            </div>
          {/if}
          {#if rule.error}
            <div class="detail">
              <div class="detail__label">Error message</div>
              <div class="detail__value">{rule.error}</div>
            </div>
          {/if}
        </div>
      </ValidationRuleCard>
    {/each}
  </div>
{:else}
  <Body size="S">There are no built-in validation rules from the schema.</Body>
{/if}

<style>
  .schema-rules {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
  .schema-details {
    display: grid;
    grid-template-columns: minmax(170px, 220px) minmax(120px, 180px) minmax(
        220px,
        1fr
      );
    gap: var(--spacing-m);
  }
  .schema-details--no-value {
    grid-template-columns: minmax(170px, 220px) minmax(220px, 1fr);
  }
  .detail {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    min-width: 0;
  }
  .detail__label {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
  }
  .detail__value {
    color: var(--spectrum-global-color-gray-900);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 900px) {
    .schema-details {
      grid-template-columns: 1fr;
    }
    .detail__value {
      white-space: normal;
    }
  }
</style>
