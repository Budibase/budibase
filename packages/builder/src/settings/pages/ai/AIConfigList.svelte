<script lang="ts">
  import { Table } from "@budibase/bbui"
  import AILogo from "./AILogo.svelte"
  import UpsertAIConfigButton from "./UpsertAIConfigButton.svelte"

  interface Props {
    configs: {
      name: string
      provider: string
      model: string
    }[]
  }

  let { configs }: Props = $props()

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
