<script>
  import StringRenderer from "./StringRenderer.svelte"
  import BooleanRenderer from "./BooleanRenderer.svelte"
  import DateTimeRenderer from "./DateTimeRenderer.svelte"
  import RelationshipRenderer from "./RelationshipRenderer.svelte"
  import AttachmentRenderer from "./AttachmentRenderer.svelte"

  export let schema
  export let value

  const plainTypes = ["string", "options", "number", "longform"]
  $: type = schema?.type ?? "string"
</script>

{#if value != null && value !== ''}
  {#if plainTypes.includes(type)}
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
