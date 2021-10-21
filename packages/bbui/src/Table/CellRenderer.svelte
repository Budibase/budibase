<script>
  import StringRenderer from "./StringRenderer.svelte"
  import BooleanRenderer from "./BooleanRenderer.svelte"
  import DateTimeRenderer from "./DateTimeRenderer.svelte"
  import RelationshipRenderer from "./RelationshipRenderer.svelte"
  import AttachmentRenderer from "./AttachmentRenderer.svelte"
  import ArrayRenderer from "./ArrayRenderer.svelte"
  import InternalRenderer from "./InternalRenderer.svelte"

  export let row
  export let schema
  export let value
  export let customRenderers = []

  let renderer
  const typeMap = {
    boolean: BooleanRenderer,
    datetime: DateTimeRenderer,
    link: RelationshipRenderer,
    attachment: AttachmentRenderer,
    string: StringRenderer,
    options: StringRenderer,
    number: StringRenderer,
    longform: StringRenderer,
    array: ArrayRenderer,
    internal: InternalRenderer,
  }
  $: type = schema?.type ?? "string"
  $: customRenderer = customRenderers?.find(x => x.column === schema?.name)
  $: renderer = customRenderer?.component ?? typeMap[type] ?? StringRenderer

  /**
   * Don't use falsy here as we want to:
   * - include empty arrays
   * - exclude 0 and booleans
   *
   * If updated, the corresponding view expression should be updated in 'server/viewBuilder.js'
   */
  const isNotSet = value => {
    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    )
  }
</script>

{#if !customRenderer && isNotSet(value)}
  <svelte:component this={StringRenderer} value={"Not Set"} secondary={true} />
{:else if renderer}
  <svelte:component this={renderer} {row} {schema} {value} on:clickrelationship>
    <slot />
  </svelte:component>
{/if}
