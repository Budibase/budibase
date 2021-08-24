<script>
  import * as yootils from 'yootils';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let type;
  export let pos = 50;
  export let fixed = false;
  export let min = 50;
  const refs = {};
  let dragging = false;

  function setPos(event) {
    const { top, bottom, left, right } = refs.container.getBoundingClientRect();
    const extents = type === 'vertical' ? [top, bottom] : [left, right];
    const px = yootils.clamp(
      type === 'vertical' ? event.clientY : event.clientX,
      extents[0] + min,
      extents[1] - min
    );
    pos = 100 * (px - extents[0]) / (extents[1] - extents[0]);
    dispatch('change');
  }

  function drag(node, callback) {
    const mousedown = event => {
      if (event.which !== 1) return;
      event.preventDefault();
      dragging = true;
      const onmouseup = () => {
        dragging = false;
        window.removeEventListener('mousemove', callback, false);
        window.removeEventListener('mouseup', onmouseup, false);
      };
      window.addEventListener('mousemove', callback, false);
      window.addEventListener('mouseup', onmouseup, false);
    }
    node.addEventListener('mousedown', mousedown, false);

    return {
      destroy() {
        node.removeEventListener('mousedown', onmousedown, false);
      }
    };
  }

  $: side = type === 'horizontal' ? 'left' : 'top';
  $: dimension = type === 'horizontal' ? 'width' : 'height';
</script>

<div class="container" bind:this={refs.container}>
  <div class="pane" style="{dimension}: {pos}%;">
    <slot name="a"></slot>
  </div>

  <div class="pane" style="{dimension}: {100 - (pos)}%;">
    <slot name="b"></slot>
  </div>

  {#if !fixed}
    <div class="{type} divider" style="{side}: calc({pos}% - 8px)" use:drag={setPos}></div>
  {/if}
</div>

{#if dragging}
  <div class="mousecatcher"></div>
{/if}

<style>
    .container {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .pane {
        position: relative;
        float: left;
        width: 100%;
        height: 100%;
        display: flex;
    }
    .mousecatcher {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,.01);
    }
    .divider {
        --border-light: var(--spectrum-global-color-gray-300);
        --border-blue: var(--spectrum-global-color-static-blue-600);
        position: absolute;
        z-index: 10;
        display: none;
    }
    .divider:after {
        content: '';
        position: absolute;
         /*background-color: #eee;*/
        background-color: var(--border-light);
    }
    .divider:hover:after {
        background-color: var(--border-blue);
    }
    .horizontal {
        padding: 0 8px;
        width: 0;
        height: 100%;
        cursor: ew-resize;
    }
    .horizontal::after {
        left: 8px;
        top: 0;
        width: 1px;
        height: 100%;
    }
    .vertical {
        padding: 8px 0;
        width: 100%;
        height: 0;
        cursor: ns-resize;
    }
    .vertical::after {
        top: 8px;
        left: 0;
        width: 100%;
        height: 1px;
    }
    .left, .right, .divider {
        display: block;
    }
    .left, .right {
        height: 100%;
        float: left;
    }
    .top, .bottom {
        position: absolute;
        width: 100%;
    }
    .top { top: 0; }
    .bottom { bottom: 0; }
</style>
