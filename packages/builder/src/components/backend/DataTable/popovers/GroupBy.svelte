<script>
  import {
    Popover,
    TextButton,
    Button,
    Icon,
    Input,
    Select,
  } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import CreateEditRecord from "../modals/CreateEditRecord.svelte"

  const CALCULATIONS = [
    {
      name: "Statistics",
      key: "stats",
    },
  ]

  export let view = {}

  let anchor
  let dropdown

  $: viewModel = $backendUiStore.models.find(
    ({ _id }) => _id === $backendUiStore.selectedView.modelId
  )
  $: fields = viewModel && Object.keys(viewModel.schema)

  function saveView() {
    backendUiStore.actions.views.save(view)
    notifier.success(`View ${view.name} saved.`)
    dropdown.hide()
  }
</script>

<div bind:this={anchor}>
  <TextButton text small active={!!view.groupBy} on:click={dropdown.show}>
    <Icon name="group" />
    Group By
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <div class="actions">
    <h5>Group By</h5>
    <div class="input-group-row">
      <p>Group By</p>
      <Select secondary thin bind:value={view.groupBy}>
        <option value="">Choose an option</option>
        {#each fields as field}
          <option value={field}>{field}</option>
        {/each}
      </Select>
    </div>
    <div class="footer">
      <Button secondary on:click={dropdown.hide}>Cancel</Button>
      <Button primary on:click={saveView}>Save</Button>
    </div>
  </div>
</Popover>

<style>
  .actions {
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  h5 {
    margin: 0;
    font-weight: 500;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }

  .input-group-row {
    display: grid;
    grid-template-columns: 75px 1fr;
    gap: var(--spacing-s);
    align-items: center;
  }

  p {
    margin: 0;
    font-size: var(--font-size-xs);
  }
</style>
