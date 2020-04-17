<script>
  import Item from "./Item.svelte"
  export let components

  console.log("Components: ", components)
</script>

{#each components as { icon, name, description }}
  <Item {icon} {name} {description} />
{/each}
