<script lang="ts">
  import type { UIComponentError } from "@budibase/types"
  import {
    builderStore,
    componentStore,
    screenComponentErrorList,
    screenComponentsList,
  } from "@/stores/builder"
  import {
    AbsTooltip,
    ActionButton,
    Icon,
    Link,
    Popover,
    PopoverAlignment,
    TooltipPosition,
  } from "@budibase/bbui"
  import CircleIndicator from "@/components/common/Icons/CircleIndicator.svelte"

  let button: any
  let popover: any

  $: hasErrors = !!$screenComponentErrorList.length

  function getErrorTitle(error: UIComponentError) {
    const titleParts = [
      $screenComponentsList.find(c => c._id === error.componentId)!
        ._instanceName,
    ]
    if (error.errorType === "setting" && error.cause === "invalid") {
      titleParts.push(error.label)
    }
    return titleParts.join(" - ")
  }

  async function onErrorClick(error: UIComponentError) {
    componentStore.select(error.componentId)
    if (error.errorType === "setting") {
      builderStore.highlightSetting(error.key, "error")
    }
  }
</script>

<div bind:this={button} class="error-button">
  <AbsTooltip
    text={!hasErrors ? "No errors found!" : ""}
    position={TooltipPosition.Top}
  >
    <ActionButton
      quiet
      disabled={!hasErrors}
      on:click={() => popover.show()}
      size="M"
      icon="warning"
    />
    {#if hasErrors}
      <div class="error-indicator">
        <CircleIndicator
          size="S"
          color="var(--spectrum-global-color-static-red-600)"
        />
      </div>
    {/if}
  </AbsTooltip>
</div>
<Popover
  bind:this={popover}
  anchor={button}
  align={PopoverAlignment.Right}
  maxWidth={400}
  showPopover={hasErrors}
>
  <div class="error-popover">
    {#each $screenComponentErrorList as error}
      <div class="error">
        <Icon
          name="warning"
          color="var(--spectrum-global-color-static-red-600)"
          size="S"
        />
        <div>
          <Link overBackground on:click={() => onErrorClick(error)}>
            {getErrorTitle(error)}
          </Link>:
          <!-- eslint-disable-next-line svelte/no-at-html-tags-->
          {@html error.message}
        </div>
      </div>
    {/each}
  </div>
</Popover>

<style>
  .error-button {
    position: relative;
  }
  .error-indicator {
    position: absolute;
    top: 0;
    right: 8px;
  }
  .error-popover {
    display: flex;
    flex-direction: column;
  }
  .error-popover .error {
    display: inline-flex;
    flex-direction: row;
    padding: var(--spacing-m);
    gap: var(--spacing-s);
    align-items: start;
  }
  .error-popover .error:not(:last-child) {
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
  }

  .error-popover .error :global(mark) {
    background: unset;
    color: unset;
  }
  .error-popover .error :global(.spectrum-Link) {
    display: inline-block;
  }
</style>
