<script>
  import { getBezierPath, EdgeLabelRenderer, BaseEdge } from "@xyflow/svelte"
  import { selectedAutomation } from "stores/builder/index.js"
  import AddStepControl from "./AddStepControl.svelte"

  export let id
  export let data

  const { block } = data

  $: path = getBezierPath($$props)

  $: steps = $selectedAutomation?.definition?.steps ?? []
  $: blockIdx = steps.findIndex(step => step.id === block.id)
  $: lastStep = !isTrigger && blockIdx + 1 === steps.length
  $: isTrigger = block.type === "TRIGGER"
</script>

<BaseEdge {id} path={path[0]} />
<EdgeLabelRenderer>
  <div
    class="add-item-label"
    style="transform:translate(-50%, -50%) translate({path[1]}px,{path[2]}px);"
  >
    <AddStepControl {lastStep} {blockIdx} />
  </div>
</EdgeLabelRenderer>

<style>
  .add-item-label {
    position: absolute;
    z-index: 123;
    color: white;
  }
</style>
