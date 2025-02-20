<script lang="ts">
  import { Icon, Tags, Tag } from "@budibase/bbui"
  import { licensing } from "@/stores/portal"
  import SnippetDrawer from "./SnippetDrawer.svelte"
  import type { Snippet } from "@budibase/types"

  $: enableSnippets = !$licensing.isFreePlan

  let snippetDrawer: SnippetDrawer
  let editableSnippet: Snippet | null

  const createSnippet = () => {
    editableSnippet = null
    snippetDrawer.show()
  }
</script>

{#if enableSnippets}
  <div class="add-button">
    <Icon size="S" name="Add" hoverable newStyles on:click={createSnippet} />
  </div>
{:else}
  <div class="title">
    <Tags>
      <Tag icon="LockClosed">Premium</Tag>
    </Tags>
  </div>
{/if}

<SnippetDrawer bind:this={snippetDrawer} snippet={editableSnippet} />

<style>
  .title {
    flex: 1 1 auto;
  }
  .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
  .add-button {
    margin-left: auto;
  }
</style>
