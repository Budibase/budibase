<script>
  import { ActionButton, AbsTooltip, Input, Icon } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let row
  export let value

  const dispatch = createEventDispatcher()

  let defaultTooltip

  $: defaultTooltip = row?.defaultValue
    ? `Default: ${row.defaultValue}`
    : "Budibase default"
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
      <ActionButton
        size="S"
        quiet
        iconOnly
        aria-label="View Budibase default text"
      >
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
