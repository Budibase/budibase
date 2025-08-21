<script lang="ts">
  import { ActionButton } from "../"
  import Icon from "../Icon/Icon.svelte"

  import { createEventDispatcher } from "svelte"

  export let type: string = "info"
  export let icon: string = "info"
  export let message: string = ""
  export let dismissable: boolean = false
  export let actionMessage: string | null = null
  export let action: ((_dismiss: () => void) => void) | null = null
  export let wide: boolean = false

  const dispatch = createEventDispatcher<{ dismiss: void }>()
</script>

<div class="spectrum-Toast spectrum-Toast--{type}" class:wide>
  {#if icon}
    <div class="toast-icon">
      <Icon
        name={icon}
        size="L"
        color="var(--spectrum-global-color-static-white)"
        weight="bold"
      />
    </div>
  {/if}
  <div class="spectrum-Toast-body" class:actionBody={!!action}>
    <div class="wrap spectrum-Toast-content">{message || ""}</div>
    {#if action}
      <ActionButton quiet on:click={() => action(() => dispatch("dismiss"))}>
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
          <Icon name="x" size="M" />
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
  .toast-icon {
    margin: 0 10px 0 -4px;
    display: grid;
    place-items: center;
  }
</style>
