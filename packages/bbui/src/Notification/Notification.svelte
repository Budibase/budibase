<script>
  import { ActionButton } from "../"

  import { createEventDispatcher } from "svelte"

  export let type = "info"
  export let icon = "Info"
  export let message = ""
  export let dismissable = false
  export let actionMessage = null
  export let action = null
  export let wide = false

  const dispatch = createEventDispatcher()
</script>

<div class="spectrum-Toast spectrum-Toast--{type}" class:wide>
  {#if icon}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeM spectrum-Toast-typeIcon"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-icon-18-{icon}" />
    </svg>
  {/if}
  <div class="spectrum-Toast-body" class:actionBody={!!action}>
    <div class="wrap spectrum-Toast-content">{message || ""}</div>
    {#if action}
      <ActionButton
        quiet
        emphasized
        on:click={() => action(() => dispatch("dismiss"))}
      >
        <div style="color: white; font-weight: 600;">{actionMessage}</div>
      </ActionButton>
    {/if}
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
  .wrap {
    overflow-wrap: anywhere;
  }

  .spectrum-Toast {
    pointer-events: all;
  }

  .wide {
    width: 100%;
  }

  .actionBody {
    justify-content: space-between;
    display: flex;
    width: 100%;
    align-items: center;
  }
</style>
