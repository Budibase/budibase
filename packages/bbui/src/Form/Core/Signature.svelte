<!--

  Should this just be Canvas.svelte?
  A drawing zone?
  Shift it somewhere else?

  width, height, toBase64, toFileObj
-->
<script>
  import { onMount } from "svelte"

  export let canvasWidth
  export let canvasHeight

  let canvasRef
  let canvas
  let mouseDown = false
  let lastOffsetX, lastOffsetY

  let touching = false
  let touchmove = false

  let debug = true
  let debugData

  export function toDataUrl() {
    return canvasRef.toDataURL()
  }

  export function clear() {
    return canvas.clearRect(0, 0, canvas.width, canvas.height)
  }

  const updated = (x, y) => {
    return lastOffsetX != x || lastOffsetY != y
  }

  // Needs touch handling
  const handleDraw = e => {
    // e.touches[0] there should ol

    e.preventDefault()

    var rect = canvasRef.getBoundingClientRect()
    const canvasX = e.offsetX || e.targetTouches?.[0].pageX - rect.left
    const canvasY = e.offsetY || e.targetTouches?.[0].pageY - rect.top

    const coords = { x: Math.round(canvasX), y: Math.round(canvasY) }
    draw(coords.x, coords.y)
    debugData = {
      coords,
      t0x: Math.round(e.touches?.[0].clientX),
      t0y: Math.round(e.touches?.[0].clientY),
      mouseOffx: e.offsetX,
      mouseOffy: e.offsetY,
    }
  }

  const draw = (xPos, yPos) => {
    if (mouseDown && updated(xPos, yPos)) {
      canvas.miterLimit = 3
      canvas.lineWidth = 3
      canvas.lineJoin = "round"
      canvas.lineCap = "round"
      canvas.strokeStyle = "white"
      canvas.stroke()
      canvas.lineTo(xPos, yPos)

      lastOffsetX = xPos
      lastOffsetY = yPos
    }
  }

  const stopTracking = () => {
    mouseDown = false
    lastOffsetX = null
    lastOffsetY = null
  }

  const canvasMouseDown = e => {
    // if (e.button != 0) {
    //   return
    // }
    mouseDown = true
    canvas.moveTo(e.offsetX, e.offsetY)
    canvas.beginPath()
  }

  onMount(() => {
    canvas = canvasRef.getContext("2d")
    canvas.imageSmoothingEnabled = true
    canvas.imageSmoothingQuality = "high"
  })
</script>

<div>
  <div>{JSON.stringify(debugData, null, 2)}</div>
  <canvas
    id="canvas"
    width={200}
    height={220}
    bind:this={canvasRef}
    on:mousemove={handleDraw}
    on:mousedown={canvasMouseDown}
    on:mouseup={stopTracking}
    on:mouseleave={stopTracking}
    on:touchstart={e => {
      touching = true
      canvasMouseDown(e)
    }}
    on:touchend={e => {
      touching = false
      touchmove = false
      stopTracking(e)
    }}
    on:touchmove={e => {
      touchmove = true
      handleDraw(e)
    }}
    on:touchleave={e => {
      touching = false
      touchmove = false
      stopTracking(e)
    }}
    class:touching={touching && debug}
    class:touchmove={touchmove && debug}
  />
</div>

<style>
  #canvas {
    border: 1px solid blueviolet;
  }
  #canvas.touching {
    border-color: aquamarine;
  }
  #canvas.touchmove {
    border-color: rgb(227, 102, 68);
  }
</style>
