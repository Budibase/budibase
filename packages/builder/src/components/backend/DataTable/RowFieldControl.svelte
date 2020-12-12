<script>
  import {
    Input,
    Select,
    Label,
    DatePicker,
    Toggle,
    RichText,
  } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { TableNames } from "constants"
  import Dropzone from "components/common/Dropzone.svelte"
  import { capitalise } from "../../../helpers"
  import LinkedRowSelector from "components/common/LinkedRowSelector.svelte"

  export let meta
  export let creating
  export let value = meta.type === "boolean" ? false : ""

  $: type = meta.type
  $: label = capitalise(meta.name)
  $: editingUser =
    !creating && $backendUiStore.selectedTable?._id === TableNames.USERS
</script>

{#if type === 'options'}
  <Select thin secondary {label} data-cy="{meta.name}-select" bind:value>
    <option value="">Choose an option</option>
    {#each meta.constraints.inclusion as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </Select>
{:else if type === 'datetime'}
  <DatePicker {label} bind:value />
{:else if type === 'attachment'}
  <div>
    <Label extraSmall grey forAttr={'dropzone-label'}>{label}</Label>
    <Dropzone bind:files={value} />
  </div>
{:else if type === 'boolean'}
  <Toggle text={label} bind:checked={value} data-cy="{meta.name}-input" />
{:else if type === 'link'}
  <LinkedRowSelector bind:linkedRows={value} schema={meta} />
{:else if type === 'longform'}
  <div>
    <Label extraSmall grey>{label}</Label>
    <RichText bind:value />
  </div>
{:else}
  <Input
    thin
    {label}
    data-cy="{meta.name}-input"
    {type}
    bind:value
    disabled={editingUser} />
{/if}
