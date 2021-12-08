<script>
  import { Table } from "@budibase/bbui"
  import CapitaliseRenderer from "components/common/renderers/CapitaliseRenderer.svelte"

  export let authConfigs = []

  const schema = {
    name: "",
    type: "",
  }
</script>

<div>
  {#if authConfigs && authConfigs.length > 0}
    <div class="query-list">
      <Table
        {schema}
        data={authConfigs}
        allowEditColumns={false}
        allowEditRows={false}
        allowSelectRows={false}
        customRenderers={[{ column: "type", component: CapitaliseRenderer }]}
      />
    </div>
  {/if}
</div>

<style>
</style>
