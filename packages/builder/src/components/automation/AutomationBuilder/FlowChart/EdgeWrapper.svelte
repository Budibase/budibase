<script lang="ts">
  import AddItemEdge from "./AddItemEdge.svelte"

  // Props from @xyflow/svelte - accept all expected props
  export let id
  export let data = undefined
  export let sourceX = undefined
  export let sourceY = undefined
  export let targetX = undefined
  export let targetY = undefined
  export let sourcePosition = undefined
  export let targetPosition = undefined
</script>

<AddItemEdge
  {id}
  {data}
  {sourceX}
  {sourceY}
  {targetX}
  {targetY}
  {sourcePosition}
  {targetPosition}
/>
