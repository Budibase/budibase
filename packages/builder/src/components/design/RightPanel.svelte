<script>
  import { setContext } from "svelte"
  import { writable, get } from "svelte/store"
  import { Icon, Body, Button } from "@budibase/bbui"

  export let icon
  export let title

  let panes = {}
  let selectedPaneIdStore = writable(null)

  const createPaneStore = pane => {
    const id = crypto.randomUUID()

    return {
      subscribe: callback => {
        panes[id] = pane

        if (get(selectedPaneIdStore) === null) {
          selectedPaneIdStore.set(id)
        }

        const unsubscribeSelectedPaneIdStore = selectedPaneIdStore.subscribe(
          selectedPaneId => callback(selectedPaneId === id)
        )

        return () => {
          delete panes[id]
          panes = panes
          unsubscribeSelectedPaneIdStore()

          if (get(selectedPaneIdStore) === id) {
            const ids = Object.keys(panes)

            if (ids.length > 0) {
              selectedPaneIdStore.set(ids[0])
            } else {
              selectedPaneIdStore.set(null)
            }
          }
        }
      },
    }
  }

  setContext("createPaneStore", createPaneStore)
</script>

<div class="panel">
  <div class="header">
    <div class="icon">
      <Icon name={icon} />
    </div>
    <Body>{title}</Body>
  </div>
  <div class="controls">
    {#each Object.entries(panes) as [id, pane]}
      <div class="button" class:active={$selectedPaneIdStore === id}>
        <Button on:click={() => selectedPaneIdStore.set(id)}>{pane}</Button>
      </div>
    {/each}
  </div>
  <div class="divider" />

  <slot />
</div>

<style>
  .panel {
    width: 310px;
    background: var(--background);
  }

  .header {
    display: flex;
    padding: 16px 14px;
    align-items: center;
  }

  .icon {
    color: var(--grey-6);
    margin-right: 8px;
  }

  .controls {
    padding: 0 14px 16px;
    display: flex;
  }

  .button:first-child {
    margin-right: 8px;
  }

  .button :global(button) {
    border-radius: 4px;
    border: none;
    background-color: var(--grey-1);
    color: var(--ink);
  }

  .button :global(button):hover {
    background-color: var(--grey-2);
  }

  .button.active :global(button) {
    background-color: var(--grey-2);
  }

  .divider {
    border-top: 1px solid var(--grey-3);
  }
</style>
