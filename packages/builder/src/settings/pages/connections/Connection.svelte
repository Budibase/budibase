<script lang="ts">
  import { type Routing } from "@/types/routing"
  import { type Readable } from "svelte/store"
  import type { UIWorkspaceConnection } from "@/types"
  import { getContext } from "svelte"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import { Layout, Icon } from "@budibase/bbui"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import RouteCrumb from "@/settings/components/RouteCrumb.svelte"

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
    icon: undefined,
    auth: [],
    props: {},
  } satisfies UIWorkspaceConnection

  $: selected = $workspaceConnections.selected ?? newConnection
  $: icon =
    selected.icon ??
    (template?.icon
      ? { type: "asset" as const, value: template.icon }
      : undefined)
</script>

{#if selected}
  <RouteCrumb>
    {#if icon?.type === "asset"}
      <img src={icon.value} height={16} width={16} alt="" />
    {:else if icon?.type === "icon"}
      <Icon name={icon.value} size="S" />
    {/if}
    <span>{selected.name}</span>
  </RouteCrumb>
  <Layout noPadding>
    <Layout gap="S" noPadding>
      {#key $routing?.params?.id}
        <APIEditor {selected} />
      {/key}
    </Layout>
  </Layout>
{/if}
