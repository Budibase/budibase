<script>
  import { notifications } from "@budibase/bbui"
  import { themeStore, appStore } from "stores/builder"
  import { Constants } from "@budibase/frontend-core"

  const onChangeTheme = async theme => {
    try {
      await themeStore.save(`spectrum--${theme}`, $appStore.appId)
    } catch (error) {
      notifications.error("Error updating theme")
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container">
  {#each Constants.Themes as theme}
    <div
      class="theme"
      class:selected={`spectrum--${theme.class}` === $themeStore.theme}
      on:click={() => onChangeTheme(theme.class)}
    >
      <div
        style="background: {theme.preview}"
        class="color spectrum--{theme.class}"
      />
      {theme.name}
    </div>
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xs);
  }
  .color {
    width: 20px;
    height: 20px;
    border-radius: 50px;
    background: var(--spectrum-global-color-gray-200);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  .theme {
    border-radius: 4px;
    padding: var(--spacing-s) var(--spacing-m);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xl);
    transition: background 130ms ease-out;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }
  .theme:hover {
    cursor: pointer;
  }
  .theme.selected,
  .theme:hover {
    background: var(--spectrum-global-color-gray-50);
  }
</style>
