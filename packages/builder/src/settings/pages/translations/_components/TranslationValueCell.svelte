<script lang="ts">
  import { ActionButton, AbsTooltip, Input, Icon } from "@budibase/bbui"
  import type { TranslationDetail } from "@budibase/types"
  import { createEventDispatcher } from "svelte"

  interface Props {
    row: {
      key: string
      defaultValue: string
    }
    value?: string | null
  }

  let { row, value }: Props = $props()
  const dispatch = createEventDispatcher<{
    buttonclick: TranslationDetail
  }>()

  const defaultTooltip = $derived(
    row.defaultValue ? "Default: " + row.defaultValue : "Budibase default"
  )
</script>

<div class="cell">
  <div class="input-wrapper">
    <div class="input-field">
      <Input
        value={value ?? ""}
        placeholder={row.defaultValue}
        quiet
        on:change={event => {
          dispatch("buttonclick", {
            key: row.key,
            value: event.detail ?? "",
          })
        }}
      />
    </div>
    <AbsTooltip text={defaultTooltip}>
      <ActionButton size="S" quiet>
        <Icon name="info" size="XS" />
      </ActionButton>
    </AbsTooltip>
  </div>
</div>

<style>
  .cell {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    width: 100%;
  }

  .input-wrapper {
    display: flex;
    gap: var(--spacing-xs);
    align-items: center;
    min-width: 0;
  }

  .input-field {
    flex: 1 1 auto;
    min-width: 0;
  }
</style>
