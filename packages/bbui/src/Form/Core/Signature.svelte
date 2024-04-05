<script>
  import { onMount, createEventDispatcher } from "svelte"
  import Icon from "../../Icon/Icon.svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let disabled = false
  export let editable = true
  export let width = 400
  export let height = 220
  export let saveIcon = false
  export let darkMode

  export function toDataUrl() {
    // PNG to preserve transparency
    return canvasRef.toDataURL("image/png")
  }

  export function toFile() {
    const data = canvas
      .getImageData(0, 0, width, height)
      .data.some(channel => channel !== 0)

    if (!data) {
      return
    }

    let dataURIParts = toDataUrl().split(",")
    if (!dataURIParts.length) {
      console.error("Could not retrieve signature data")
    }

    // Pull out the base64 encoded byte data
    let binaryVal = atob(dataURIParts[1])
    let blobArray = new Uint8Array(binaryVal.length)
    let pos = 0
    while (pos < binaryVal.length) {
      blobArray[pos] = binaryVal.charCodeAt(pos)
      pos++
    }

    const signatureBlob = new Blob([blobArray], {
      type: "image/png",
    })

    return new File([signatureBlob], "signature.png", {
      type: signatureBlob.type,
    })
  }

  export function clearCanvas() {
    return canvas.clearRect(0, 0, canvasWidth, canvasHeight)
  }

  const updatedPos = (x, y) => {
    return lastOffsetX != x || lastOffsetY != y
  }

  const handleDraw = e => {
    e.preventDefault()
    if (disabled || !editable) {
      return
    }
    var rect = canvasRef.getBoundingClientRect()
    const canvasX = e.offsetX || e.targetTouches?.[0].pageX - rect.left
    const canvasY = e.offsetY || e.targetTouches?.[0].pageY - rect.top

    const coords = { x: Math.round(canvasX), y: Math.round(canvasY) }
    draw(coords.x, coords.y)
  }

  const draw = (xPos, yPos) => {
    if (drawing && updatedPos(xPos, yPos)) {
      canvas.miterLimit = 2
      canvas.lineWidth = 2
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
    if (!canvas) {
      return
    }
    canvas.closePath()
    drawing = false
    lastOffsetX = null
    lastOffsetY = null
  }

  const canvasContact = e => {
    if (disabled || !editable || (!e.targetTouches && e.button != 0)) {
      return
    } else if (!updated) {
      updated = true
      clearCanvas()
    }
    drawing = true
    canvas.beginPath()
    canvas.moveTo(e.offsetX, e.offsetY)
  }

  let canvasRef
  let canvas
  let canvasWrap
  let drawing = false
  let updated = false
  let lastOffsetX, lastOffsetY
  let canvasWidth
  let canvasHeight
  let signature
  let urlFailed

  $: if (value) {
    const [attachment] = value || []
    signature = attachment
  }

  $: if (signature?.url) {
    updated = false
  }

  onMount(() => {
    if (!editable) {
      return
    }

    canvasWrap.style.width = `${width}px`
    canvasWrap.style.height = `${height}px`

    const { width: wrapWidth, height: wrapHeight } =
      canvasWrap.getBoundingClientRect()

    canvasHeight = wrapHeight
    canvasWidth = wrapWidth

    canvas = canvasRef.getContext("2d")
    canvas.imageSmoothingEnabled = true
  })
</script>

<div class="signature" class:light={!darkMode} class:image-error={urlFailed}>
  {#if !disabled}
    <div class="overlay">
      {#if updated && saveIcon}
        <span class="save">
          <Icon
            name="Checkmark"
            hoverable
            tooltip={"Save"}
            tooltipPosition={"top"}
            tooltipType={"info"}
            on:click={() => {
              dispatch("change", toDataUrl())
            }}
          />
        </span>
      {/if}
      {#if signature?.url && !updated}
        <span class="delete">
          <Icon
            name="DeleteOutline"
            hoverable
            tooltip={"Delete"}
            tooltipPosition={"top"}
            tooltipType={"info"}
            on:click={() => {
              if (editable) {
                clearCanvas()
              }
              dispatch("clear")
            }}
          />
        </span>
      {/if}
    </div>
  {/if}
  {#if !editable && signature?.url}
    <!-- svelte-ignore a11y-missing-attribute -->
    {#if !urlFailed}
      <img
        src={signature?.url}
        on:error={() => {
          urlFailed = true
        }}
      />
    {:else}
      Could not load signature
    {/if}
  {:else}
    <div bind:this={canvasWrap} class="canvas-wrap">
      <canvas
        id="canvas"
        width={canvasWidth}
        height={canvasHeight}
        bind:this={canvasRef}
        on:mousemove={handleDraw}
        on:mousedown={canvasContact}
        on:mouseup={stopTracking}
        on:mouseleave={stopTracking}
        on:touchstart={canvasContact}
        on:touchend={stopTracking}
        on:touchmove={handleDraw}
        on:touchleave={stopTracking}
      />
      {#if editable}
        <div class="indicator-overlay">
          <div class="sign-here">
            <Icon name="Close" />
            <hr />
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .indicator-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding: var(--spectrum-global-dimension-size-150);
    box-sizing: border-box;
    pointer-events: none;
  }
  .sign-here {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spectrum-global-dimension-size-150);
  }
  .sign-here hr {
    border: 0;
    border-top: 2px solid var(--spectrum-global-color-gray-200);
    width: 100%;
  }
  .canvas-wrap {
    position: relative;
    margin: auto;
  }
  .signature img {
    max-width: 100%;
  }
  .signature.light img,
  .signature.light #canvas {
    -webkit-filter: invert(100%);
    filter: invert(100%);
  }
  .signature.image-error .overlay {
    padding-top: 0px;
  }
  .signature {
    width: 100%;
    height: 100%;
    position: relative;
    text-align: center;
  }
  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    padding: var(--spectrum-global-dimension-size-150);
    text-align: right;
    z-index: 2;
    box-sizing: border-box;
  }
  .save,
  .delete {
    display: inline-block;
  }
</style>
