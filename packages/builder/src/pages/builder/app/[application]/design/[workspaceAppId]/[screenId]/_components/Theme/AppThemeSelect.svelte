<script>
  import { notifications } from "@budibase/bbui"
  import { themeStore, appStore } from "@/stores/builder"
  import { ThemeOptions, getThemeClassNames } from "@budibase/shared-core"

  const onChangeTheme = async theme => {
    try {
      await themeStore.save(theme, $appStore.appId)
    } catch (error) {
      notifications.error("Error updating theme")
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container">
  {#each ThemeOptions as themeMeta}
    <div
      class="theme"
      class:selected={themeMeta.id === $themeStore.theme}
      on:click={() => onChangeTheme(themeMeta.id)}
    >
      <div class="color {getThemeClassNames(themeMeta.id)}" />
      {themeMeta.name}
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
