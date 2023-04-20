<script>
  import { _ } from "../../../../../../../lang/i18n"
  import { Body, Label, Input } from "@budibase/bbui"
  import { onMount } from "svelte"

  export let parameters

  onMount(() => {
    if (!parameters.confirm) {
      parameters.confirm = true
    }
  })
</script>

<div class="root">
  <Body size="S"
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.PromptUser.Enter_message"
    )}</Body
  >
  <div class="params">
    <Label small
      >{$_(
        "components.design.settings.controls.ButtonActionEditor.actions.PromptUser.Title"
      )}</Label
    >
    <Input
      placeholder={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.PromptUser.Prompt User"
      )}
      bind:value={parameters.customTitleText}
    />
    <Label small
      >{$_(
        "components.design.settings.controls.ButtonActionEditor.actions.PromptUser.Message"
      )}</Label
    >
    <Input
      placeholder={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.PromptUser.want_continue?"
      )}
      bind:value={parameters.confirmText}
    />
  </div>
</div>

<style>
  .root {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }

  .root :global(p) {
    line-height: 1.5;
  }

  .params {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
  }
</style>
