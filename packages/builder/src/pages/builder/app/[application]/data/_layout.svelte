<script>
  import { Button, Layout } from "@budibase/bbui"
  import DatasourceNavigator from "components/backend/DatasourceNavigator/DatasourceNavigator.svelte"
  import Panel from "components/design/Panel.svelte"
  import { isActive, goto } from "@roxi/routify"
  import BetaButton from "./_components/BetaButton.svelte"
</script>

<!-- routify:options index=1 -->
<div class="data">
  {#if !$isActive("./new")}
    <Panel title="Sources" borderRight>
      <Layout paddingX="L" paddingY="XL" gap="S">
        <Button cta on:click={() => $goto("./new")}>Add source</Button>
        <DatasourceNavigator />
      </Layout>
    </Panel>
  {/if}

  <div class="content">
    <slot />
  </div>
  <BetaButton />
</div>

<style>
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
  }
</style>
