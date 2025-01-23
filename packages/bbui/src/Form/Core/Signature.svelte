<script>
  import { onMount, createEventDispatcher } from "svelte"
  import Atrament from "atrament"
  import Icon from "../../Icon/Icon.svelte"

  const dispatch = createEventDispatcher()

  let last

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
    const data = canvasContext
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
    return canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
  }

  let canvasRef
  let canvasContext
  let canvasWrap
  let canvasWidth
  let canvasHeight
  let signature

  let updated = false
  let signatureFile
  let urlFailed

  $: if (value) {
    signatureFile = value
  }

  $: if (signatureFile?.url) {
    updated = false
  }

  $: if (last) {
    dispatch("update")
  }

  onMount(() => {
    if (!editable) {
      return
    }

    const getPos = e => {
      let rect = canvasRef.getBoundingClientRect()
      const canvasX = e.offsetX || e.targetTouches?.[0].pageX - rect.left
      const canvasY = e.offsetY || e.targetTouches?.[0].pageY - rect.top

      return { x: canvasX, y: canvasY }
    }

    const checkUp = e => {
      last = getPos(e)
    }

    canvasRef.addEventListener("pointerdown", e => {
      const current = getPos(e)
      //If the cursor didn't move at all, block the default pointerdown
      if (last?.x === current?.x && last?.y === current?.y) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    })

    document.addEventListener("pointerup", checkUp)

    signature = new Atrament(canvasRef, {
      width,
      height,
      color: "white",
    })

    signature.weight = 4
    signature.smoothing = 2

    canvasWrap.style.width = `${width}px`
    canvasWrap.style.height = `${height}px`

    const { width: wrapWidth, height: wrapHeight } =
      canvasWrap.getBoundingClientRect()

    canvasHeight = wrapHeight
    canvasWidth = wrapWidth

    canvasContext = canvasRef.getContext("2d")

    return () => {
      signature.destroy()
      document.removeEventListener("pointerup", checkUp)
    }
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
      {#if signatureFile?.url && !updated}
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
  {#if !editable && signatureFile?.url}
    <!-- svelte-ignore a11y-missing-attribute -->
    {#if !urlFailed}
      <img
        src={signatureFile?.url}
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
        id="signature-canvas"
        bind:this={canvasRef}
        style="--max-sig-width: {width}px; --max-sig-height: {height}px"
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
  #signature-canvas {
    max-width: var(--max-sig-width);
    max-height: var(--max-sig-height);
  }
  .signature.light img,
  .signature.light #signature-canvas {
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
