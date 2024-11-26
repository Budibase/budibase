<script>
  import { getContext, onMount } from "svelte"
  import { generate } from "shortid"

  export let path

  let dropEle
  let dzid = generate()

  const view = getContext("draggableView")

  onMount(() => {
    // Always return up-to-date values
    view.update(state => {
      return {
        ...state,
        dropzones: {
          ...(state.dropzones || {}),
          [dzid]: {
            get dims() {
              return dropEle.getBoundingClientRect()
            },
            path,
          },
        },
      }
    })
  })
</script>

<div
  id={`dz-${dzid}`}
  bind:this={dropEle}
  class="drag-zone"
  class:drag-over={$view?.droptarget === dzid}
>
  <span class="move-to">Move to</span>
</div>

<style>
  .drag-zone.drag-over {
    background-color: #1ca872b8;
  }
  .drag-zone {
    min-height: calc(var(--spectrum-global-dimension-size-225) + 12px);
    min-width: 100%;
    background-color: rgba(28, 168, 114, 0.2);
    border-radius: 4px;
    border: 1px dashed #1ca872;
    position: relative;
    text-align: center;
  }
  .move-to {
    position: absolute;
    left: 0;
    right: 0;
    top: -50%;
    margin: auto;
    width: fit-content;
    font-weight: 600;
    border-radius: 8px;
    padding: 4px 8px;
    background-color: rgb(28, 168, 114);
    color: var(--spectrum-global-color-gray-50);
  }
</style>
