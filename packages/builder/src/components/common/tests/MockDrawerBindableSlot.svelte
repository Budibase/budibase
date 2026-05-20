<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let value: any = ""
  export let type: string | undefined = undefined
  export let disabled = false

  const dispatch = createEventDispatcher()

  const isValidBoolean = (value: any) =>
    value == null || value === "" || value === "true" || value === "false"

  const isValidDate = (value: any) =>
    !value || !Number.isNaN(new Date(value).valueOf())

  $: showFreeForm =
    (type === "boolean" && !isValidBoolean(value)) ||
    ((type === "date" || type === "datetime") && !isValidDate(value))

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    value = target.value
    dispatch("change", target.value)
  }

  const onBlur = (event: Event) => {
    const target = event.target as HTMLInputElement
    dispatch("blur", target.value)
  }
</script>

{#if showFreeForm}
  <input
    aria-label="Binding value"
    {disabled}
    value={value}
    on:input={onInput}
    on:blur={onBlur}
  />
  <button
    aria-label="Clear binding value"
    type="button"
    {disabled}
    on:click={() => dispatch("change", "")}
  >
    X
  </button>
{:else}
  <slot />
{/if}
