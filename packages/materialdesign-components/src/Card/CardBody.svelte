<script>
  export let _bb
  export let isPrimaryAction = false
  export let onClick = () => {}

  let cardBody
  let cls = isPrimaryAction ? "mdc-card__primary-action" : ""

  $: cardBody && _bb.attachChildren(cardBody)
</script>

<div bind:this={cardBody} class={cls} on:click={onClick} />
