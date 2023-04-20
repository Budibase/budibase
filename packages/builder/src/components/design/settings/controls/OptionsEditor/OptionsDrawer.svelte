<script>
  import { _ } from "../../../../../../lang/i18n"
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
        <Body size="S"
          >{$_(
            "components.design.settings.controls.OptionEditor.OptionsDrawer.Add_option"
          )}</Body
        >
      {/if}
      {#if options?.length}
        <div class="options">
          <Label
            >{$_(
              "components.design.settings.controls.OptionEditor.OptionsDrawer.Label"
            )}</Label
          >
          <Label
            >{$_(
              "components.design.settings.controls.OptionEditor.OptionsDrawer.Value"
            )}</Label
          >
          <div />
          {#each options as option (option.id)}
            <Input
              placeholder={$_(
                "components.design.settings.controls.OptionEditor.OptionsDrawer.Label"
              )}
              bind:value={option.label}
            />
            <Input
              placeholder={$_(
                "components.design.settings.controls.OptionEditor.OptionsDrawer.Value"
              )}
              bind:value={option.value}
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
          {$_(
            "components.design.settings.controls.OptionEditor.OptionsDrawer.Add_Option"
          )}
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
