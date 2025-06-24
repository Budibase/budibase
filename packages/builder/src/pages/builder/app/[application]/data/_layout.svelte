<script>
  import { Layout } from "@budibase/bbui"
  import DatasourceNavigator from "@/components/backend/DatasourceNavigator/DatasourceNavigator.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { isActive, redirect, goto, params } from "@roxi/routify"
  import { datasources } from "@/stores/builder"
  import NavHeader from "@/components/common/NavHeader.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"

  let searchValue

  $: {
    // If we ever don't have any data other than the users table, prompt the
    // user to add some
    // Don't redirect if setting up google sheets, or we lose the query parameter
    if (!$datasources.hasData && !$params["?continue_google_setup"]) {
      $redirect("./new")
    }
  }
</script>

<!-- routify:options index=1 -->
<div class="wrapper">
  {#if $featureFlags[FeatureFlag.WORKSPACE_APPS]}
    <TopBar breadcrumbs={[{ text: "Data" }]} icon="plugs-connected"></TopBar>
  {/if}
  <div class="data">
    {#if !$isActive("./new")}
      <Panel borderRight borderBottomHeader={false}>
        <span class="panel-title-content" slot="panel-title-content">
          <NavHeader
            title="Sources"
            placeholder="Search for sources"
            bind:value={searchValue}
            onAdd={() => $goto("./new")}
          />
        </span>
        <Layout paddingX="L" paddingY="none" gap="S">
          <DatasourceNavigator searchTerm={searchValue} />
        </Layout>
      </Panel>
    {/if}

    <div class="content">
      <slot />
    </div>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
  }
  .data {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    height: 0;
  }
  .content {
    padding: 28px 40px 40px 40px;
    overflow-y: auto;
    gap: var(--spacing-l);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex: 1 1 auto;
    z-index: 1;
    position: relative;
  }

  .panel-title-content {
    display: contents;
  }
</style>
