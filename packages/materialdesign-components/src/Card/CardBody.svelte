<script>
  export let _bb
  export let onClick = () => {}

  let cardBody

  $: cardBody && _bb.attachChildren(cardBody)
</script>

<div bind:this={cardBody} class="mdc-card__primary-action" on:click={onClick} />
