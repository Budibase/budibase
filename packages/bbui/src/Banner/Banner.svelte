<script>
  import { createEventDispatcher } from "svelte"
  import Icon from "../Icon/Icon.svelte"

  let dispatch = createEventDispatcher()

  export let type = "info"
  export let icon = "info"
  export let size = "S"
  export let extraButtonText = undefined
  export let extraButtonAction = undefined
  export let extraLinkText = undefined
  export let extraLinkAction = undefined
  export let showCloseButton = true

  let show = true

  function clear() {
    show = false
    dispatch("change")
  }
</script>

{#if show}
  <div class="spectrum-Toast spectrum-Toast--{type}">
    <Icon name={icon} {size} />
    <div class="spectrum-Toast-body">
      <div class="spectrum-Toast-content row-content">
        <slot />
        {#if extraLinkText}
          <button class="link" on:click={extraLinkAction}>
            <u>{extraLinkText}</u>
          </button>
        {/if}
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
    {#if showCloseButton}
      <div class="spectrum-Toast-buttons">
        <button
          class="spectrum-ClearButton spectrum-ClearButton--overBackground spectrum-ClearButton--size{size}"
          on:click={clear}
        >
          <div class="spectrum-ClearButton-fill">
            <Icon name="x" {size} />
          </div>
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .spectrum-Toast {
    pointer-events: all;
    width: 100%;
  }

  .spectrum-Toast--neutral {
    background-color: var(--grey-2);
  }
  .spectrum-Button {
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .row-content {
    display: flex;
  }

  .link {
    background: none;
    border: none;
    margin: 0;
    margin-left: 0.5em;
    padding: 0;
    cursor: pointer;
    color: white;
    font-weight: 600;
  }

  u {
    font-weight: 600;
  }
</style>
