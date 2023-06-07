<script>
  import "@spectrum-css/label/dist/index-vars.css"
  import Badge from "../Badge/Badge.svelte"
  export let value

  const displayLimit = 5

  $: arrayValue = Array.isArray(value) ? value : [value].filter(x => !!x)
  $: badges = arrayValue.slice(0, displayLimit)
  $: leftover = arrayValue.length - badges.length
</script>

{#each badges as badge}
  <Badge size="S" grey>{badge}</Badge>
{/each}
{#if leftover}
  <div>+{leftover} more</div>
{/if}
