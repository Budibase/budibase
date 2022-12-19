<script>
  import "@spectrum-css/label/dist/index-vars.css"
  import Badge from "../Badge/Badge.svelte"
  export let value

  const displayLimit = 5

  $: badges = Array.isArray(value) ? value.slice(0, displayLimit) : []
  $: leftover = (value?.length ?? 0) - badges.length
</script>

{#each badges as badge}
  <Badge size="S" grey>{badge}</Badge>
{/each}
{#if leftover}
  <div>+{leftover} more</div>
{/if}
