<script>
  import { createEventDispatcher } from "svelte"

  let dispatch = createEventDispatcher()

  export let type = "info"
  export let icon = "Info"
  export let size = "S"
  export let extraButtonText
  export let extraButtonAction

  let show = true

  function clear() {
    show = false
    dispatch("change")
  }
</script>

{#if show}
  <div class="spectrum-Toast spectrum-Toast--{type}">
    <svg
      class="spectrum-Icon spectrum-Icon--size{size} spectrum-Toast-typeIcon"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-icon-18-{icon}" />
    </svg>
    <div class="spectrum-Toast-body">
      <div class="spectrum-Toast-content">
        <slot />
      </div>
      {#if extraButtonText && extraButtonAction}
        <button
          class="spectrum-Button spectrum-Button--sizeM spectrum-Button--overBackground spectrum-Button--quiet"
          on:click={extraButtonAction}
        >
          <span class="spectrum-Button-label">{extraButtonText}</span>
        </button>
      {/if}
    </div>
    <div class="spectrum-Toast-buttons">
      <button
        class="spectrum-ClearButton spectrum-ClearButton--overBackground spectrum-ClearButton--size{size}"
        on:click={clear}
      >
        <div class="spectrum-ClearButton-fill">
          <svg
            class="spectrum-ClearButton-icon spectrum-Icon spectrum-UIIcon-Cross100"
            focusable="false"
            aria-hidden="true"
          >
            <use xlink:href="#spectrum-css-icon-Cross100" />
          </svg>
        </div>
      </button>
    </div>
  </div>
{/if}

<style>
  .spectrum-Toast {
    pointer-events: all;
    width: 100%;
  }
</style>
