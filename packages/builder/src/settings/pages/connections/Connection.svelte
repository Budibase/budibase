<script lang="ts">
  import { type Routing } from "@/types/routing"
  import { type Readable } from "svelte/store"
  import type { UIWorkspaceConnection } from "@/types"
  import { WorkspaceConnectionType } from "@budibase/types"
  import { getContext } from "svelte"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import { Layout } from "@budibase/bbui"
  import { restTemplates } from "@/stores/builder/restTemplates"

  import APIEditor from "./APIEditor.svelte"

  export let create: boolean = false

  const routing: Readable<Routing> = getContext("routing")

  $: workspaceConnections.select($routing?.params?.id ?? null)
  $: storeSelected = $workspaceConnections.selected
  $: templateId = $routing?.params?.templateId
  $: template = templateId ? restTemplates.getById(templateId) : undefined

  $: newConnection = {
    source: "workspace_connection",
    sourceId: "",
    name: template?.name || "",
    type: WorkspaceConnectionType.WORKSPACE_CONNECTION,
    templateId: template?.id,
    templateVersion: template?.specs?.[0]?.version,
    auth: [],
    props: {},
  } as UIWorkspaceConnection

  $: selected = create ? newConnection : storeSelected
</script>

{#if selected}
  <Layout noPadding>
    <Layout gap="S" noPadding>
      {#key $routing?.params?.id}
        <APIEditor {selected} {create} />
      {/key}
    </Layout>
  </Layout>
{/if}
