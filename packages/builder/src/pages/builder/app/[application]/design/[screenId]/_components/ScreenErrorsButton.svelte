<script lang="ts">
  import type { UIComponentError } from "@budibase/types"
  import {
    builderStore,
    componentStore,
    screenComponentErrorList,
    screenComponentsList,
  } from "@/stores/builder"
  import { ActionButton, Icon, Link, Popover } from "@budibase/bbui"

  let button: any
  let popover: any

  function getErrorTitle(error: UIComponentError) {
    const titleParts = [
      $screenComponentsList.find(c => c._id === error.componentId)!
        ._instanceName,
    ]
    if (error.errorType === "setting") {
      titleParts.push(error.label)
    }
    return titleParts.join(" - ")
  }

  function onErrorClick(error: UIComponentError) {
    componentStore.select(error.componentId)
    if (error.errorType === "setting") {
      builderStore.highlightSetting(error.key, "error")

      // TODO: dry from AppPreview
      const selector = `#${error.key}-prop-control`
      const element = document.querySelector(selector)?.parentElement
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }
</script>

<div bind:this={button} class="error-button">
  <ActionButton selected quiet on:click={() => popover.show()}>
    <div class="content">
      Errors
      {#if $screenComponentErrorList.length}
        <div class="badge">
          {$screenComponentErrorList.length}
        </div>
      {/if}
    </div>
  </ActionButton>
</div>
<Popover bind:this={popover} anchor={button} align={"right"} maxWidth={400}>
  <div class="error-popover">
    {#each $screenComponentErrorList as error}
      <div class="error">
        <Icon
          name="Alert"
          color="var(--spectrum-global-color-static-red-600)"
        />
        <div>
          <Link overBackground on:click={() => onErrorClick(error)}>
            {getErrorTitle(error)}:</Link
          >
          <!-- eslint-disable-next-line svelte/no-at-html-tags-->
          {@html error.message}
        </div>
      </div>
    {/each}
  </div>
</Popover>

<style>
  .error-button :global(.spectrum-ActionButton) {
    border-radius: 16px;
  }
  .error-button .content {
    min-width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    padding-left: var(--spacing-xs);
    padding-right: var(--spacing-xs);
  }
  .error-button .badge {
    background-color: var(--spectrum-global-color-static-red-700);
    height: 18px;
    width: 18px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  .error-popover {
    display: flex;
    flex-direction: column;
  }
  .error-popover .error {
    display: inline-flex;
    flex-direction: row;
    padding: var(--spacing-xl) var(--spacing-m);
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
</style>
