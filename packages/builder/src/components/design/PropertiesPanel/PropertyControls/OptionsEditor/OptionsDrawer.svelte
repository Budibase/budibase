<script>
  import {
    Icon,
    Button,
    Input,
    DrawerContent,
    Layout,
    Body,
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
    <Layout noPadding>
      <Body size="S">
        {#if !options.length}
          Add a custom option.
        {/if}
      </Body>

      <div class="options">
        {#each options as option (option.id)}
          <Input
            placeholder="Label"
            bind:value={option.label}
            label="Label"
            labelPosition="left"
          />
          <Input
            placeholder="Value"
            bind:value={option.value}
            label="Value"
            labelPosition="left"
          />
          <Icon
            name="Close"
            hoverable
            size="S"
            on:click={() => removeOption(option.id)}
          />
        {/each}
      </div>
      <div>
        <Button icon="AddCircle" size="M" on:click={addOption} secondary
          >Add Option</Button
        >
      </div>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }
  .options {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    align-items: center;
    grid-template-columns: auto auto 20px;
  }
</style>
