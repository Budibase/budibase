<script>
  import { goto } from "@roxi/routify"
  import { Table } from "@budibase/bbui"
  import ArrayRenderer from "@/components/common/renderers/ArrayRenderer.svelte"
  import Controls from "./Controls.svelte"
  import Panel from "../Panel.svelte"
  import Tooltip from "../Tooltip.svelte"

  export let datasource

  let tableSchema = {
    name: {},
    primary: { displayName: "Primary Key" },
  }
</script>

<Panel>
  <Controls slot="controls" {datasource} />
  <Tooltip
    slot="tooltip"
    title="Using data in your app"
    href="https://docs.budibase.com/docs/data"
  />
  <Table
    on:click={({ detail: table }) => $goto(`../../table/${table._id}`)}
    schema={tableSchema}
    data={Object.values(datasource?.entities || {})}
    allowEditColumns={false}
    allowEditRows={false}
    allowSelectRows={false}
    customRenderers={[{ column: "primary", component: ArrayRenderer }]}
  />
</Panel>
