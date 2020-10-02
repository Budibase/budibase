<script>
  import { Button, Input, Select } from "@budibase/bbui"
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"

  export let onClosed

  let name
  let field

  $: fields = Object.keys($backendUiStore.selectedModel.schema).filter(key => {
    return $backendUiStore.selectedModel.schema[key].type === "number"
  })
  $: views = $backendUiStore.models.flatMap(model =>
    Object.keys(model.views || {})
  )

  function saveView() {
    if (views.includes(name)) {
      notifier.danger(`View exists with name ${name}.`)
      return
    }
    backendUiStore.actions.views.save({
      name,
      modelId: $backendUiStore.selectedModel._id,
      field,
    })
    notifier.success(`View ${name} created`)
    onClosed()
    $goto(`../../../view/${name}`)
  }
</script>

<div class="actions">
  <h5>Create View</h5>
  <Input label="View Name" thin bind:value={name} />
  <div class="footer">
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button primary on:click={saveView}>Save View</Button>
  </div>
</div>

<style>
  h5 {
    margin: 0;
    font-weight: 500;
  }

  .actions {
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }
</style>
