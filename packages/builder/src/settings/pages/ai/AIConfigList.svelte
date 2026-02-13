<script lang="ts">
  import { Table } from "@budibase/bbui"
  import AILogo from "./AILogo.svelte"
  import UpsertAIConfigButton from "./UpsertAIConfigButton.svelte"

  export let configs: {
    name: string
    provider: string
    model: string
  }[]

  const customRenderers = [
    {
      column: "icon",
      component: AILogo,
    },
    {
      column: "edit",
      component: UpsertAIConfigButton,
    },
  ]

  const schema = {
    icon: { width: "40px" },
    name: { width: "200px" },
    model: {},
    edit: { width: "100px", align: "Right" },
  }
</script>

<Table
  compact
  data={configs}
  {schema}
  {customRenderers}
  hideHeader
  rounded
  allowClickRows={false}
  allowEditRows={false}
></Table>
