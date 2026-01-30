<script lang="ts">
  import "@spectrum-css/textfield/dist/index-vars.css"
  import Field from "./Field.svelte"
  import Tag from "../Tags/Tag.svelte"
  import type { LabelPosition } from "../types"
  import { createEventDispatcher } from "svelte"

  export let value: string[] = []
  export let label: string | undefined = undefined
  export let labelPosition: LabelPosition = "above"
  export let error: string | undefined = undefined
  export let helpText: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let id: string | undefined = undefined
  export let delimiter = ","
  export let splitOnSpace = false
  export let allowDuplicates = false
  export let maxItems: number | undefined = undefined

  let inputValue = ""
  let focused = false
  let inputEl: HTMLInputElement | null = null

  const dispatch = createEventDispatcher()

  const updateValue = (next: string[]) => {
    value = next
    dispatch("change", next)
  }

  const notifyMax = () => {
    if (maxItems != null) {
      dispatch("max", maxItems)
    }
  }

  const addTokens = (tokens: string[]) => {
    const cleaned = tokens.map(token => token.trim()).filter(Boolean)
    if (!cleaned.length) {
      return
    }

    if (maxItems != null && value.length >= maxItems) {
      notifyMax()
      return
    }

    const available =
      maxItems != null ? Math.max(maxItems - value.length, 0) : cleaned.length
    if (available === 0) {
      notifyMax()
      return
    }

    const next = cleaned.slice(0, available).reduce(
      (acc, token) => {
        if (allowDuplicates || !acc.includes(token)) {
          acc.push(token)
        }
        return acc
      },
      [...value]
    )

    updateValue(next)

    if (maxItems != null && cleaned.length > available) {
      notifyMax()
    }
  }

  const removeToken = (index: number) => {
    updateValue(value.filter((_, idx) => idx !== index))
  }

  const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  const getSplitPattern = () => {
    const parts = [escapeRegExp(delimiter)]
    if (splitOnSpace) {
      parts.push("\\s")
    }
    return new RegExp(`(?:${parts.join("|")})+`)
  }

  const shouldSplit = (value: string) => {
    const pattern = getSplitPattern()
    return pattern.test(value)
  }

  const handleInput = (event: Event) => {
    if (readonly || disabled) {
      return
    }
    const target = event.target as HTMLInputElement
    inputValue = target.value
    if (shouldSplit(inputValue)) {
      const pattern = getSplitPattern()
      const endsWithSeparator = new RegExp(`${pattern.source}$`).test(
        inputValue
      )
      const hasDelimiterSpace = new RegExp(
        `${escapeRegExp(delimiter)}\\s+`
      ).test(inputValue)
      const parts = inputValue.split(pattern).filter(Boolean)
      const shouldCommitAll =
        hasDelimiterSpace && parts.length > 1 && !endsWithSeparator
      const trailing =
        endsWithSeparator || shouldCommitAll ? "" : (parts.pop() ?? "")
      addTokens(parts)
      inputValue = trailing
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTokens([inputValue])
      inputValue = ""
    }
    dispatch("blur", value)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (readonly || disabled) {
      return
    }
    if (
      event.key === delimiter ||
      (splitOnSpace && event.key === " " && !event.shiftKey)
    ) {
      event.preventDefault()
      addTokens([inputValue])
      inputValue = ""
    }
    if (event.key === "Backspace" && !inputValue && value.length) {
      removeToken(value.length - 1)
    }
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <div
    class="pill-input spectrum-Textfield"
    class:is-disabled={disabled}
    class:is-focused={focused}
    class:is-invalid={!!error}
    role="presentation"
    on:click={() => {
      if (!disabled && !readonly) {
        inputEl?.focus()
      }
    }}
  >
    <div class="pill-list">
      {#each value as pill, index (pill + index)}
        <Tag closable emphasized on:remove={() => removeToken(index)}>
          {pill}
        </Tag>
      {/each}
    </div>
    <input
      class="spectrum-Textfield-input pill-input-field"
      bind:value={inputValue}
      bind:this={inputEl}
      {id}
      {disabled}
      {readonly}
      placeholder={placeholder ?? ""}
      on:input={handleInput}
      on:keydown={handleKeydown}
      on:focus={() => (focused = true)}
      on:blur={() => {
        focused = false
        handleBlur()
      }}
    />
  </div>
</Field>

<style>
  .pill-input {
    width: 100%;
    min-width: 0;
    min-height: var(--spectrum-textfield-height);
    padding: var(--spectrum-textfield-padding-top)
      var(--spectrum-textfield-padding-right)
      var(--spectrum-textfield-padding-bottom)
      calc(var(--spectrum-textfield-padding-left) - 1px);
    border: var(--spectrum-textfield-border-size) solid
      var(
        --spectrum-textfield-m-border-color,
        var(--spectrum-alias-border-color)
      );
    border-radius: var(--spectrum-textfield-border-radius);
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
    display: flex;
    box-sizing: border-box;
    align-items: center;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }
  .pill-input.is-focused {
    border-color: var(
      --spectrum-textfield-m-border-color-down,
      var(--spectrum-alias-border-color-mouse-focus)
    );
  }
  .pill-input.is-invalid {
    border-color: var(
      --spectrum-textfield-m-border-color-error,
      var(--spectrum-semantic-negative-color-default)
    );
  }
  .pill-input.is-disabled {
    background-color: var(
      --spectrum-textfield-m-background-color-disabled,
      var(--spectrum-global-color-gray-200)
    );
    border-color: var(
      --spectrum-textfield-m-border-color-disabled,
      var(--spectrum-global-color-gray-400)
    );
  }
  .pill-input-field {
    min-width: 120px;
    flex: 1 1 120px;
    padding: 0;
    height: auto;
    line-height: 20px;
    border: none;
    background: transparent;
    outline: none;
  }
  .pill-input :global(.spectrum-Tags-item) {
    margin: 0;
    --spectrum-tag-height: var(--spectrum-global-dimension-size-300);
  }
  .pill-input :global(.spectrum-Tags-itemLabel) {
    line-height: 1;
    display: inline-flex;
    align-items: center;
    padding-left: 4px;
    padding-right: 2px;
  }
  .pill-input :global(.spectrum-ClearButton) {
    width: 16px;
    height: 16px;
  }
  .pill-input :global(.spectrum-ClearButton i) {
    font-size: 12px;
  }
  .pill-list {
    display: contents;
  }
</style>
