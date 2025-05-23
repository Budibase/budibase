<script lang="ts">
  import { Layout } from "@budibase/bbui"
  import type { UIWorkspaceApp } from "@budibase/types"
  import NewScreenModal from "../../../_components/NewScreen/index.svelte"
  import ScreenNavItem from "./ScreenNavItem.svelte"

  export let workspaceApp: UIWorkspaceApp
  export let searchValue: string

  let newScreenModal: NewScreenModal

  $: noResultsMessage = searchValue
    ? "There aren't screens matching that route"
    : ""
</script>

{#each workspaceApp.screens as screen (screen._id)}
  <div class="screen">
    <ScreenNavItem {screen} />
  </div>
{:else}
  <Layout paddingY="none" paddingX="L">
    <div class="no-results">{noResultsMessage}</div>
  </Layout>
{/each}

<NewScreenModal bind:this={newScreenModal} />

<style>
  .no-results {
    color: var(--spectrum-global-color-gray-600);
  }
</style>
