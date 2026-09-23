<script lang="ts">
  export let items: { _id: string; _instanceName: string }[] = []
  export let listTypeProps: { duplicateButton: (id: string) => void }
</script>

{#each items as item}
  <button
    aria-label={`Copy ${item._instanceName}`}
    on:click={() => listTypeProps.duplicateButton(item._id)}
  >
    Copy
  </button>
{/each}
