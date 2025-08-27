<script lang="ts">
  import CustomEdge from "./CustomEdge.svelte"
  import type { Position } from "@xyflow/svelte"

  export let id: string
  export let data: any = undefined
  export let sourceX: number
  export let sourceY: number
  export let targetX: number
  export let targetY: number
  export let sourcePosition: Position
  export let targetPosition: Position
  export let source: string
  export let target: string
  export let type: string
  export let markerStart: string | undefined = undefined
  export let markerEnd: string | undefined = undefined
  export let sourceHandleId: string | null | undefined = undefined
  export let targetHandleId: string | null | undefined = undefined
</script>

<CustomEdge
  {id}
  {data}
  {sourceX}
  {sourceY}
  {targetX}
  {targetY}
  {sourcePosition}
  {targetPosition}
  {source}
  {target}
  {type}
  {markerStart}
  {markerEnd}
  {sourceHandleId}
  {targetHandleId}
/>
