<script lang="ts">
  import { screenComponentErrorList, screenComponents } from "@/stores/builder"
  import { ActionButton, Icon, Popover } from "@budibase/bbui"

  let button: any
  let popover: any
</script>

<div bind:this={button}>
  <ActionButton selected quiet on:click={() => popover.show()}>
    <div class="error-button">
      Errors
      {#if $screenComponentErrorList.length}
        <div class="error-button-badge">
          {$screenComponentErrorList.length}
        </div>
      {/if}
    </div>
  </ActionButton>
</div>
<Popover bind:this={popover} anchor={button} align={"right"} maxWidth={400}>
  <div class="errors">
    {#each $screenComponentErrorList as error}
      <div class="error">
        <Icon
          name="Alert"
          color="var(--spectrum-global-color-static-red-600)"
        />
        <div>
          <span class="error-title">
            {$screenComponents[error.componentId]._instanceName}:
          </span>
          <!-- eslint-disable-next-line svelte/no-at-html-tags-->
          {@html error.message}
        </div>
      </div>
    {/each}
  </div>
</Popover>

<style>
  .error-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  .error-button-badge {
    background-color: var(--spectrum-global-color-static-red-700);
    height: 18px;
    width: 18px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  .errors {
    display: flex;
    flex-direction: column;
  }
  .error {
    display: inline-flex;
    flex-direction: row;
    padding: var(--spacing-l);
    gap: var(--spacing-s);
  }
  .error:not(:last-child) {
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
  }

  .error-title {
    font-weight: 700;
    text-decoration: underline;
  }

  .error :global(mark) {
    background: unset;
    color: unset;
  }
</style>
