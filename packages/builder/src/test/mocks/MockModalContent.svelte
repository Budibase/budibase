<script lang="ts">
  export let onConfirm = () => {}
  export let size = "M"
  export let title = ""
  export let confirmText = "Save"
  export let disabled = false
</script>

<div data-testid="modal-content" data-size={size}>
  {#if title}
    <h1>{title}</h1>
  {/if}
  <slot name="header" />
  <slot />
  <button type="button" on:click={onConfirm} {disabled}>
    {confirmText}
  </button>
</div>
