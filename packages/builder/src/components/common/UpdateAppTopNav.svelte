<script>
  import { Icon } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { appStore } from "@/stores/builder"
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="app-heading"
  on:click={() => {
    $goto(`/builder/app/${$appStore.appId}/settings/general`)
  }}
>
  <slot />
  <span class="edit-icon">
    <Icon size="S" name="pencil" color={"var(--grey-7)"} />
  </span>
</div>

<style>
  .app-heading {
    display: flex;
    cursor: pointer;
    align-items: center;
    gap: var(--spacing-s);
  }
  .edit-icon {
    display: none;
  }
  .app-heading:hover .edit-icon {
    display: inline;
  }
</style>
