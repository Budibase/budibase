<script lang="ts">
  import {
    componentStore,
    screenComponentErrorList,
    screenComponents,
  } from "@/stores/builder"
  import { ActionButton, Icon, Popover } from "@budibase/bbui"

  let button: any
  let popover: any
</script>

<div bind:this={button}>
  <ActionButton selected quiet on:click={() => popover.show()}
    >Errors ({$screenComponentErrorList.length})</ActionButton
  >
</div>
<Popover bind:this={popover} open anchor={button} align={"right"}>
  <div class="errors">
    {#each $screenComponentErrorList as error}
      <div class="error">
        <Icon
          name="Alert"
          color="var(--spectrum-global-color-static-red-600)"
        />
        <div>
          {$screenComponents[error.componentId]._instanceName}:
          {error.message}
        </div>
      </div>
    {/each}
  </div>
</Popover>

<style>
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
</style>
