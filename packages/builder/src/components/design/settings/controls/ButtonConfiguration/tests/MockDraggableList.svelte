<script lang="ts">
  export let items = []
  export let listTypeProps
</script>

{#each items as item}
  <button
    aria-label={`Copy ${item._instanceName}`}
    on:click={() => listTypeProps.duplicateButton(item._id)}
  >
    Copy
  </button>
{/each}
