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

  $: card && _bb.attachChildren(card)
</script>

<div
  bind:this={card}
  style={`width: ${width}; height: ${height}`}
  class={cardClass} />

<!-- <CardHeader title="Eyeoo" subtitle="efe wfew rregreg" />
  <CardBody isPrimaryAction>
    <CardImage url="https://picsum.photos/350/200" />
    <H6 text="Body Header" horizontalMargin={10} />
    <Body2 text="something something mc something" horizontalMargin={10} />
  </CardBody>
  <CardFooter>
    <Button {_bb} text="Save" />
    <Button {_bb} text="Cancel" />
    <IconButton icon="3d_rotation" />
    <IconButton icon="accessibility" />
    <IconButton icon="alarm" />

  </CardFooter> -->
