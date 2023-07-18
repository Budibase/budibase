<script>
  import Pane from "components/design/Pane.svelte"
  import {
    ColorPicker,
    Input,
    Label,
    ActionGroup,
    ActionButton,
    Checkbox,
    notifications,
    Icon,
    Body,
    Button,
    Select,
  } from "@budibase/bbui"
  import { DefaultAppTheme } from "constants"
  import { store } from "builderStore"

  const update = async (key, value) => {
    try {
      let navigation = $store.navigation
      navigation[key] = value
      await store.actions.navigation.save(navigation)
    } catch (error) {
      notifications.error("Error updating navigation settings")
    }
  }
</script>

<Pane title="Customize">
  <div class="info">
    <div class="infoHeader">
      <Icon name="InfoOutline" />
      <Body size="S">CHANGES WILL APPLY TO ALL SCREENS</Body>
    </div>
    <Body>
      Your navigation is configured for all the screens within your app.
    </Body>
  </div>
  <div class="configureLinks">
    <Button cta>Configure Links</Button>
  </div>
  <div class="controls">
    <div class="label">
      <Label size="M">Position</Label>
    </div>
    <ActionGroup quiet>
      <ActionButton
        selected={$store.navigation.navigation === "Top"}
        quiet={$store.navigation.navigation !== "Top"}
        icon="PaddingTop"
        on:click={() => update("navigation", "Top")}
      />
      <ActionButton
        selected={$store.navigation.navigation === "Left"}
        quiet={$store.navigation.navigation !== "Left"}
        icon="PaddingLeft"
        on:click={() => update("navigation", "Left")}
      />
    </ActionGroup>

    {#if $store.navigation.navigation === "Top"}
      <div class="label">
        <Label size="M">Sticky header</Label>
      </div>
      <Checkbox
        value={$store.navigation.sticky}
        on:change={e => update("sticky", e.detail)}
      />
      <div class="label">
        <Label size="M">Width</Label>
      </div>
      <Select
        options={["Max", "Large", "Medium", "Small"]}
        plaveholder={null}
        value={$store.navigation.navWidth}
        on:change={e => update("navWidth", e.detail)}
      />
    {/if}
    <div class="label">
      <Label size="M">Show logo</Label>
    </div>
    <Checkbox
      value={!$store.navigation.hideLogo}
      on:change={e => update("hideLogo", !e.detail)}
    />
    {#if !$store.navigation.hideLogo}
      <div class="label">
        <Label size="M">Logo URL</Label>
      </div>
      <Input
        value={$store.navigation.logoUrl}
        on:change={e => update("logoUrl", e.detail)}
        updateOnChange={false}
      />
    {/if}
    <div class="label">
      <Label size="M">Show title</Label>
    </div>
    <Checkbox
      value={!$store.navigation.hideTitle}
      on:change={e => update("hideTitle", !e.detail)}
    />
    {#if !$store.navigation.hideTitle}
      <div class="label">
        <Label size="M">Title</Label>
      </div>
      <Input
        value={$store.navigation.title}
        on:change={e => update("title", e.detail)}
        updateOnChange={false}
      />
    {/if}
    <div class="label">
      <Label>Background</Label>
    </div>
    <ColorPicker
      spectrumTheme={$store.theme}
      value={$store.navigation.navBackground || DefaultAppTheme.navBackground}
      on:change={e => update("navBackground", e.detail)}
    />
    <div class="label">
      <Label>Text</Label>
    </div>
    <ColorPicker
      spectrumTheme={$store.theme}
      value={$store.navigation.navTextColor || DefaultAppTheme.navTextColor}
      on:change={e => update("navTextColor", e.detail)}
    />
  </div>
</Pane>

<style>
  .controls {
    position: relative;
    display: grid;
    grid-template-columns: 90px 1fr;
    align-items: start;
    transition: background 130ms ease-out, border-color 130ms ease-out;
    border-left: 4px solid transparent;
    margin: 0 calc(-1 * var(--spacing-xl));
    padding: 0 var(--spacing-xl) 0 calc(var(--spacing-xl) - 4px);
    gap: 12px;
  }

  .label {
    margin-top: 16px;
    transform: translateY(-50%);
  }

  .info {
    background-color: var(--background-alt);
    padding: 12px;
    margin-bottom: 12px;
  }

  .infoHeader {
    display: flex;
    margin-bottom: 5px;
    border-radius: 4px;
  }

  .infoHeader :global(svg) {
    margin-right: 5px;
    color: var(--grey-6);
  }

  .infoHeader :global(p) {
    color: var(--grey-6);
  }

  .configureLinks :global(button) {
    margin-bottom: 20px;
    width: 100%;
  }
</style>
