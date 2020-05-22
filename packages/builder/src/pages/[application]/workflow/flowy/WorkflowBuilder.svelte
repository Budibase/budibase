<script>
  import { onMount } from "svelte"
  import { workflowStore, backendUiStore } from "builderStore";
  import api from "builderStore/api";

  let canvas
  let workflow
  let instanceId = $backendUiStore.selectedDatabase._id; 

  $: workflow = $workflowStore.workflows.find(wf => wf._id === $workflowStore.selectedWorkflowId)

  // $: if (workflow && workflow.uiTree) flowy.import(workflow.uiTree);

  onMount(() => {
    flowy(canvas, onGrab, onRelease, onSnap);
  });

  function onGrab(block) {
    console.log(block);
  }

  function onSnap(block, first, parent){
    workflow.uiTree = flowy.output();
    workflowStore.actions.update({ instanceId, workflow })
    return true;
  }

  function onRelease() {
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
