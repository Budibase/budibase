<script lang="ts">
  import {
    Icon,
    Popover,
    PopoverAlignment,
    type PopoverAPI,
  } from "@budibase/bbui"

  interface Props {
    value?: string[]
    disabled?: boolean
    placeholder?: string
    onchange?: (value: string[]) => void
  }

  let {
    value = [],
    disabled = false,
    placeholder = "Add values",
    onchange,
  }: Props = $props()

  let popover = $state<PopoverAPI>()
  let anchor = $state<HTMLElement>()
  let draft = $state("")

  const displayValue = $derived(
    value.length ? `(${value.length}) ${value.join(", ")}` : ""
  )

  const add = () => {
    const entries = draft
      .split(",")
      .map(entry => entry.trim())
      .filter(Boolean)
    const next = entries.reduce(
      (acc, entry) => (acc.includes(entry) ? acc : [...acc, entry]),
      [...value]
    )
    draft = ""
    if (next.length !== value.length) {
      onchange?.(next)
    }
  }

  const remove = (index: number) => {
    onchange?.(value.filter((_, i) => i !== index))
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()
      add()
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  bind:this={anchor}
  class="spectrum-InputGroup array-input"
  class:is-disabled={disabled}
  aria-haspopup="true"
  onclick={() => !disabled && popover?.show()}
>
  <div class="spectrum-Textfield spectrum-InputGroup-textfield">
    <input
      {disabled}
      readonly
      type="text"
      class="spectrum-Textfield-input spectrum-InputGroup-input"
      {placeholder}
      value={displayValue}
    />
  </div>
  {#if !disabled}
    <button
      type="button"
      class="spectrum-Picker spectrum-Picker--sizeM spectrum-InputGroup-button"
      tabindex="-1"
    >
      <Icon name="list-bullets" />
    </button>
  {/if}
</div>

<Popover
  bind:this={popover}
  {anchor}
  align={PopoverAlignment.Left}
  widthMode="fixed-to-anchor"
  resizable={false}
>
  <div class="array-popover">
    {#each value as entry, index}
      <div class="array-entry">
        <span class="array-entry-label">{entry}</span>
        <button
          type="button"
          class="array-entry-remove"
          aria-label="Remove {entry}"
          onclick={() => remove(index)}
        >
          <Icon name="x" size="XS" />
        </button>
      </div>
    {/each}
    <div class="array-add">
      <input
        type="text"
        class="spectrum-Textfield-input array-add-input"
        placeholder="Type a value and press Enter"
        bind:value={draft}
        onkeydown={onKeydown}
        onblur={add}
      />
      <button
        type="button"
        class="array-entry-remove"
        aria-label="Add value"
        onclick={add}
      >
        <Icon name="plus" size="XS" />
      </button>
    </div>
  </div>
</Popover>

<style>
  .array-input {
    width: 100%;
    min-width: 0;
    cursor: pointer;
  }
  .array-input .spectrum-Textfield {
    width: 100%;
    min-width: 0;
  }
  .array-input .spectrum-Textfield-input {
    pointer-events: none;
    width: 100%;
  }
  .array-input.is-disabled {
    pointer-events: none;
  }

  .array-popover {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-s);
  }
  .array-entry,
  .array-add {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
    min-height: 28px;
  }
  .array-entry-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: var(--spacing-xs);
  }
  .array-entry-remove {
    display: flex;
    padding: 4px;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  .array-add-input {
    flex: 1;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
    background: var(--spectrum-global-color-gray-50);
    color: inherit;
    padding: 4px var(--spacing-s);
    height: 28px;
  }
  .array-add-input:focus {
    outline: none;
    border-color: var(--spectrum-global-color-blue-400);
  }
</style>
