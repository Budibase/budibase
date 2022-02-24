<script>
  import { createEventDispatcher } from "svelte"

  export let type = "info"
  export let icon = "Info"
  export let message = ""
  export let dismissable = false

  const dispatch = createEventDispatcher()
</script>

<div class="spectrum-Toast spectrum-Toast--{type}">
  {#if icon}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeM spectrum-Toast-typeIcon"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-icon-18-{icon}" />
    </svg>
  {/if}
  <div class="spectrum-Toast-body">
    <div class="spectrum-Toast-content">{message || ""}</div>
  </div>
  {#if dismissable}
    <div class="spectrum-Toast-buttons">
      <button
        class="spectrum-ClearButton spectrum-ClearButton--overBackground spectrum-ClearButton--sizeM"
        on:click={() => dispatch("dismiss")}
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
  {/if}
</div>

<style>
  .spectrum-Toast {
    pointer-events: all;
  }
</style>
