<script lang="ts">
  import { type Routing } from "@/types/routing"
  import { type Readable } from "svelte/store"
  import type { UIWorkspaceConnection } from "@/types"
  import { getContext } from "svelte"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import { Layout } from "@budibase/bbui"
  import { restTemplates } from "@/stores/builder/restTemplates"

  import APIEditor from "./APIEditor.svelte"

  const routing: Readable<Routing> = getContext("routing")

  $: workspaceConnections.select($routing?.params?.id ?? null)
  $: templateId = $routing?.params?.templateId
  $: template = templateId ? restTemplates.getById(templateId) : undefined

  $: newConnection = {
    source: "datasource",
    sourceId: "",
    name: template?.name || "",
    templateId: template?.id,
    templateVersion: template?.specs?.[0]?.version,
    auth: [],
    props: {},
  } satisfies UIWorkspaceConnection

  $: selected = $workspaceConnections.selected ?? newConnection
</script>

{#if selected}
  <Layout noPadding>
    <Layout gap="S" noPadding>
      {#key $routing?.params?.id}
        <APIEditor {selected} />
      {/key}
    </Layout>
  </Layout>
{/if}
