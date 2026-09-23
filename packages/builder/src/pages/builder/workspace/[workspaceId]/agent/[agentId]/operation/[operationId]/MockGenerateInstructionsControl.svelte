<script lang="ts">
  export let onApplyInstructions: (instructions: string) => void
</script>

<button
  type="button"
  on:click={() =>
    onApplyInstructions("Use {{ budibase.Inventory.update_row }}")}
>
  Apply generated instructions
</button>
