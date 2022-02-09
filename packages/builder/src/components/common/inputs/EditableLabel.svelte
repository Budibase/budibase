<script>
  import { Heading, Icon, Input, Label, Body } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  let dispatch = createEventDispatcher()

  export let defaultValue = ""
  export let value
  export let type = "label"
  export let size = "M"

  let editing = false

  function setEditing(state) {
    editing = state
    if (editing) {
      dispatch("change")
    }
  }

  function save() {
    dispatch("save", value)
  }
</script>

<div class="parent">
  {#if !editing}
    {#if type === "heading"}
      <Heading {size}>{value || defaultValue}</Heading>
    {:else if type === "body"}
      <Body {size}>{value || defaultValue}</Body>
    {:else}
      <Label {size}>{value || defaultValue}</Label>
    {/if}
    <div class="hide">
      <Icon name="Edit" hoverable size="S" on:click={() => setEditing(true)} />
    </div>
  {:else}
    <div class="input">
      <Input placeholder={defaultValue} bind:value on:change />
    </div>
    <Icon
      name="SaveFloppy"
      hoverable
      size="S"
      on:click={() => {
        setEditing(false)
        save()
      }}
    />
  {/if}
</div>

<style>
  .parent {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .hide {
    display: none;
    margin-top: 5px;
  }
  .parent:hover .hide {
    display: block;
  }
  .input {
    flex: 1;
  }
</style>
