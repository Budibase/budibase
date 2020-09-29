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
  import CreateEditRecord from "./CreateEditRecord.svelte"

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
  $: fields =
    viewModel &&
    Object.keys(viewModel.schema).filter(
      field => viewModel.schema[field].type === "number"
    )

  function saveView() {
    backendUiStore.actions.views.save(view)
    notifier.success(`View ${view.name} saved.`)
    dropdown.hide()
  }
</script>

<div bind:this={anchor}>
  <TextButton text small on:click={dropdown.show} active={!!view.field}>
    <Icon name="calculate" />
    Calculate
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <div class="actions">
    <h5>Calculate</h5>
    <div class="input-group-row">
      <p>The</p>
      <Select secondary thin bind:value={view.calculation}>
        <option value="">Choose an option</option>
        {#each CALCULATIONS as calculation}
          <option value={calculation.key}>{calculation.name}</option>
        {/each}
      </Select>
      <p>of</p>
      <Select secondary thin bind:value={view.field}>
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
    grid-template-columns: 30px 1fr 20px 1fr;
    gap: var(--spacing-s);
    align-items: center;
  }

  p {
    margin: 0;
    font-size: var(--font-size-xs);
  }
</style>
