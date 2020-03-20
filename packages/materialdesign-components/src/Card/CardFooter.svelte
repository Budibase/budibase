<script>
  import { onMount } from "svelte"
  let cardFooter
  export let _bb
  export let padding = "5px"

  onMount(() => {
    _bb.setContext(
      "BBMD:icon-button:context",
      "mdc-card__action mdc-card__action--icon"
    )
    _bb.setContext(
      "BBMD:button:context",
      "mdc-card__action mdc-card__action--button"
    )
  })

  $: cardFooter && _bb.attachChildren(cardFooter)
</script>

<div
  bind:this={cardFooter}
  style={`padding: ${padding}`}
  class="mdc-card__actions bbmd-card__actions" />

<style>
  .bbmd-card__actions {
    display: flex;
    flex-flow: row wrap;
  }
</style>
