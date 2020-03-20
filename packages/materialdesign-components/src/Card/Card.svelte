<script>
  import CardHeader from "./CardHeader.svelte"
  import CardBody from "./CardBody.svelte"
  import CardImage from "./CardImage.svelte"
  import CardFooter from "./CardFooter.svelte"
  import { H2, H6, Body2 } from "../Typography"
  import { Button } from "../Button"
  import { IconButton } from "../IconButton"
  import ClassBuilder from "../ClassBuilder.js"

  export let width = "350px"
  export let height = "auto"
  export let variant = "standard"

  export let _bb
  let card

  const cb = new ClassBuilder("card", ["standard"])

  $: modifiers = { variant }
  $: props = { modifiers }
  $: cardClass = cb.build({ props })

  $: safeWidth = width !== "auto" && !/px$/.test(width) ? `${width}px` : width
  $: safeHeight =
    height !== "auto" && !/px$/.test(height) ? `${width}px` : height

  $: card && _bb.attachChildren(card)
</script>

<div
  bind:this={card}
  style={`width: ${safeWidth}; height: ${safeHeight}`}
  class={cardClass} />
