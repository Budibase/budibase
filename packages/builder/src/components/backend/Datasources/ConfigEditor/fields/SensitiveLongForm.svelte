<script lang="ts">
  import { Label, TextArea, Icon } from "@budibase/bbui"
  import { onMount } from "svelte"

  export let name
  export let value
  export let error
  export let placeholder
  export let visible: boolean

  onMount(() => {
    visible = !value
  })
</script>

<div class="form-row">
  <Label>{name}</Label>
  <div class="textarea-wrapper">
    {#if visible}
      <TextArea on:blur on:change {value} {error} {placeholder} />
    {:else}
      <TextArea
        on:blur
        on:change
        value={value ? "••••••••••••••••" : ""}
        {error}
        {placeholder}
      />
    {/if}
    <button
      type="button"
      class="visibility-toggle"
      on:click={() => (visible = !visible)}
      title={visible ? "Hide" : "Show"}
    >
      <Icon name={visible ? "eye-slash" : "eye"} size="S" hoverable />
    </button>
  </div>
</div>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: start;
  }

  .textarea-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .visibility-toggle {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    background-color: var(--background);
    border: 1px solid var(--border-light);
  }

  .visibility-toggle:hover {
    background-color: var(--background-alt);
  }
</style>
