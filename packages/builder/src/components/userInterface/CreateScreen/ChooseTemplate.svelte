<script>
  import { store, backendUiStore } from "builderStore"
  import { Input, Select, Button, Spacer } from "@budibase/bbui"
  import getTemplates from "builderStore/store/screenTemplates"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  let screens
  let template

  $: templates = getTemplates($store, $backendUiStore.models)

  const save = () => {
    if (!template) return
    if (template === "none") {
      dispatch("next")
      return
    }

    store.createScreen({
      screen: template.create(),
    })

    dispatch("finished")
  }

  const cancel = () => {
    dispatch("finished")
  }
</script>

<div data-cy="new-screen-dialog">

  <div class="bb-margin-xl">
    <label>Choose a Template</label>
    <Select bind:value={template} secondary>
      <option value="">Choose an Option</option>
      <option value="none">No Template</option>
      {#if templates}
        {#each templates as template}
          <option value={template}>{template.name}</option>
        {/each}
      {/if}
    </Select>
  </div>
</div>

<Spacer extraLarge />

<div data-cy="create-screen-footer" class="modal-footer">
  <Button secondary medium on:click={cancel}>Cancel</Button>
  <Button blue medium on:click={save} disabled={!template}>
    {template === 'none' ? 'Next' : 'Create Screen'}
  </Button>
</div>

<style>
  .modal-footer {
    display: flex;
    justify-content: space-between;
  }
</style>
