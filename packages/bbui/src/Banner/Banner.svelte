<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import Icon from "../Icon/Icon.svelte"

  const dispatch = createEventDispatcher<{ change: void }>()

  export let type: string = "info"
  export let icon: string = "info"
  export let size: "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" = "S"
  export let extraButtonText: string | undefined = undefined
  export let extraButtonAction: (() => void) | undefined = undefined
  export let extraLinkText: string | undefined = undefined
  export let extraLinkAction: (() => void) | undefined = undefined
  export let showCloseButton: boolean = true
  export let closeButtonTooltip: string | undefined = undefined

  let show = true

  const clear = () => {
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
          aria-label={closeButtonTooltip}
          title={closeButtonTooltip}
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

  .spectrum-Toast {
    border-radius: 0px;
  }
  .spectrum-Toast-body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
