<script>
  import StringRenderer from "./StringRenderer.svelte"
  import BooleanRenderer from "./BooleanRenderer.svelte"
  import DateTimeRenderer from "./DateTimeRenderer.svelte"
  import RelationshipRenderer from "./RelationshipRenderer.svelte"
  import AttachmentRenderer from "./AttachmentRenderer.svelte"

  export let schema
  export let value
  export let customRenderers = []

  const plainTypes = ["string", "options", "number", "longform"]
  $: type = schema?.type ?? "string"
  $: customRenderer = customRenderers?.find(x => x.column === schema?.name)
</script>

{#if value != null && value !== ''}
  {#if customRenderer}
    <svelte:component this={customRenderer.component} {value} />
  {:else if plainTypes.includes(type)}
    <StringRenderer {value} />
  {:else if type === 'boolean'}
    <BooleanRenderer {value} />
  {:else if type === 'datetime'}
    <DateTimeRenderer {value} />
  {:else if type === 'link'}
    <RelationshipRenderer {value} />
  {:else if type === 'attachment'}
    <AttachmentRenderer {value} />
  {/if}
{/if}
