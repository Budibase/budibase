<script>
  import { BaseEdge } from "@xyflow/svelte"
  import { NodeWidth, GridResolution } from "./constants"
  import { getContext } from "svelte"

  export let sourceX
  export let sourceY

  const { bounds } = getContext("flow")

  $: bracketWidth = GridResolution * 3
  $: bracketHeight = $bounds.height / 2 + GridResolution * 2
  $: path = getCurlyBracePath(
    sourceX + bracketWidth,
    sourceY - bracketHeight,
    sourceX + bracketWidth,
    sourceY + bracketHeight
  )

  const getCurlyBracePath = (x1, y1, x2, y2) => {
    const w = 2 // Thickness
    const q = 1 // Intensity
    const i = 28 // Inner radius strenth (lower is stronger)
    const j = 32 // Outer radius strength (higher is stronger)

    // Calculate unit vector
    let dx = x1 - x2
    let dy = y1 - y2
    let len = Math.sqrt(dx * dx + dy * dy)
    dx = dx / len
    dy = dy / len

    // Path control points
    const qx1 = x1 + q * w * dy - j
    const qy1 = y1 - q * w * dx
    const qx2 = x1 - 0.25 * len * dx + (1 - q) * w * dy - i
    const qy2 = y1 - 0.25 * len * dy - (1 - q) * w * dx
    const tx1 = x1 - 0.5 * len * dx + w * dy - bracketWidth
    const ty1 = y1 - 0.5 * len * dy - w * dx
    const qx3 = x2 + q * w * dy - j
    const qy3 = y2 - q * w * dx
    const qx4 = x1 - 0.75 * len * dx + (1 - q) * w * dy - i
    const qy4 = y1 - 0.75 * len * dy - (1 - q) * w * dx

    return `M ${x1} ${y1} Q ${qx1} ${qy1} ${qx2} ${qy2} T ${tx1} ${ty1} M ${x2} ${y2} Q ${qx3} ${qy3} ${qx4} ${qy4} T ${tx1} ${ty1}`
  }
</script>

<BaseEdge
  {...$$props}
  {path}
  style="--width:{NodeWidth}px; --x:{sourceX}px; --y:{sourceY}px;"
/>

<style>
  :global(#basic-bracket) {
    animation-timing-function: linear(1, 0);
  }
  :global(#admin-bracket) {
    transform: scale(-1, 1) translateX(calc(var(--width) + 8px));
    transform-origin: var(--x) var(--y);
  }
</style>
