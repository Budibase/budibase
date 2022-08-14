<script>
  import { notifications, Slider, Icon } from "@budibase/bbui"
  import { store } from "builderStore"

  const ThemeOptions = [
    "spectrum--darkest",
    "spectrum--dark",
    "spectrum--light",
    "spectrum--lightest",
  ]

  $: themeIndex = ThemeOptions.indexOf($store.theme) ?? 2

  const onChangeTheme = async e => {
    try {
      const theme = ThemeOptions[e.detail] ?? ThemeOptions[2]
      await store.actions.theme.save(theme)
    } catch (error) {
      notifications.error("Error updating theme")
    }
  }
</script>

<div class="container">
  <Icon name="Moon" />
  <Slider
    min={0}
    max={3}
    step={1}
    value={themeIndex}
    on:change={onChangeTheme}
  />
  <Icon name="Light" />
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
  div :global(.spectrum-Form-item) {
    flex: 1 1 auto;
  }
</style>
