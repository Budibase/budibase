<script>
  import { onMount } from "svelte"

  export let workflow = {}

  let canvas

  onMount(() => {
    if (workflow.uiTree) {
      flowy.import(workflow.uiTree);
      return;
    } 

    flowy(canvas, onGrab, onRelease);
  })

  function onGrab() {

  }

  function onRelease() {
    console.log("RELEASED!")
  }

  // function onGrab(block) {
  //   // When the user grabs a block
  // }
  // function onRelease() {
  //   // When the user releases a block
  //   console.log(flowy.output())
  // }
  // function onSnap(block, first, parent) {
  //   console.log(flowy.output())
  //   console.log(block, first, parent)
  //   // When a block snaps with another one
  // }
  // function onRearrange(block, parent) {
  //   console.log(block, parent)
  //   // When a block is rearranged
  // }
</script>

<section bind:this={canvas} class="canvas" />
