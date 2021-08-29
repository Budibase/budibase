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
  import { _ as t } from "svelte-i18n"

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
        <Body size="S">{ $t('add-an-option-to-get-started') }</Body>
      {/if}
      {#if options?.length}
        <div class="options">
          {#each options as option (option.id)}
            <Input
              placeholder={ $t('label') }
              bind:value={option.label}
              label={ $t('label') }
              labelPosition="left"
            />
            <Input
              placeholder={ $t('value') }
              bind:value={option.value}
              label={ $t('value') }
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
      {/if}
      <div>
        <Button icon="AddCircle" size="M" on:click={addOption} secondary>
          { $t('add-option') }
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
