<script>
  import {
    Icon,
    Button,
    Input,
    DrawerContent,
    Layout,
    Body,
    Label,
  } from "@budibase/bbui"
  import { generate } from "shortid"

  export let options = []

  const removeOption = id => {
    options = options.filter(option => option.id !== id)
  }

  const addOption = () => {
    options = [
      ...options,
      {
        id: generate(),
        label: null,
        value: null,
      },
    ]
  }
</script>

<DrawerContent>
  <div class="container">
    <Layout noPadding gap="S">
      {#if !options.length}
        <Body size="S">Add an option to get started.</Body>
      {/if}
      {#if options?.length}
        <div class="options">
          <Label>Label</Label>
          <Label>Value</Label>
          <div />
          {#each options as option (option.id)}
            <Input placeholder="Label" bind:value={option.label} />
            <Input placeholder="Value" bind:value={option.value} />
            <Icon
              name="Close"
              hoverable
              size="S"
              on:click={() => removeOption(option.id)}
            />
          {/each}
        </div>
      {/if}
      <div>
        <Button icon="AddCircle" size="M" on:click={addOption} secondary>
          Add Option
        </Button>
      </div>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  .options {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    align-items: center;
    grid-template-columns: 1fr 1fr auto;
  }
</style>
