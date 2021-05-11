<script>
  import StringRenderer from "./StringRenderer.svelte"
  import BooleanRenderer from "./BooleanRenderer.svelte"
  import DateTimeRenderer from "./DateTimeRenderer.svelte"
  import RelationshipRenderer from "./RelationshipRenderer.svelte"
  import AttachmentRenderer from "./AttachmentRenderer.svelte"

  export let row
  export let schema
  export let value
  export let customRenderers = []

  const plainTypes = ["string", "options", "number", "longform"]
  const typeMap = {
    boolean: BooleanRenderer,
    datetime: DateTimeRenderer,
    link: RelationshipRenderer,
    attachment: AttachmentRenderer,
    string: StringRenderer,
    options: StringRenderer,
    number: StringRenderer,
    longform: StringRenderer,
  }
  $: type = schema?.type ?? "string"
  $: customRenderer = customRenderers?.find(x => x.column === schema?.name)
  $: renderer = customRenderer?.component ?? typeMap[type] ?? StringRenderer
</script>

{#if renderer && (customRenderer || (value != null && value !== ""))}
  <svelte:component this={renderer} {row} {schema} {value} on:clickrelationship>
    <slot />
  </svelte:component>
{/if}
