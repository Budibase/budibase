<script>
  import { Input, Select } from "@budibase/bbui"
  import { find, map, keys, reduce, keyBy } from "lodash/fp"
  import { pipe } from "components/common/core"
  import { EVENT_TYPE_MEMBER_NAME } from "components/common/eventHandlers"
  import { store, workflowStore } from "builderStore"
  import { ArrowDownIcon } from "components/common/Icons/"
  import { createEventDispatcher } from "svelte"

  export let parameter

  let isOpen = false

  const capitalize = s => {
    if (typeof s !== "string") return ""
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
</script>

<div class="handler-option">
  {#if parameter.name === 'workflow'}
    <span>{parameter.name}</span>
  {/if}
  {#if parameter.name === 'workflow'}
    <Select on:change bind:value={parameter.value}>
      <option value="" />
      {#each $workflowStore.workflows.filter(wf => wf.live) as workflow}
        <option value={workflow._id}>{workflow.name}</option>
      {/each}
    </Select>
  {:else}
    <Input
      name={parameter.name}
      label={capitalize(parameter.name)}
      on:change
      value={parameter.value} />
  {/if}
</div>

<style>
  .handler-option {
    display: flex;
    flex-direction: column;
  }

  span {
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: 500;
  }
</style>
