<script>
  import DevToolsStat from "./DevToolsStat.svelte"

  export let name
  export let value
  export let settingsMap

  $: prettyName = settingsMap?.[name]?.label
</script>

{#if prettyName}
  <DevToolsStat label={prettyName} value={JSON.stringify(value)} />
{/if}
