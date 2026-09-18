<script lang="ts">
  import { getContext } from "svelte"
  import { goto, isActive, params } from "@roxi/routify"
  import {
    Context,
    Detail,
    Input,
    Icon,
    ModalContent,
    notifications,
    type ModalAPI,
  } from "@budibase/bbui"
  import { BUILDER_URLS, ThemeOptions } from "@budibase/shared-core"
  import {
    FeatureFlag,
    type Datasource,
    type FeatureFlags,
    type Query,
    type Screen,
    type Table,
    type Theme,
    type UIAutomation,
    type UIInternalDatasource,
    type View,
    type ViewV2,
  } from "@budibase/types"

  import { IntegrationTypes } from "@/constants/backend"
  import {
    automationStore,
    datasources,
    deploymentStore,
    queries,
    tables,
    previewStore,
    sortedScreens,
    workspaceStore,
    views,
    viewsV2,
  } from "@/stores/builder"
  import { featureFlags, themeStore } from "@/stores/portal"
  import { bb } from "@/stores/bb"

  interface Command {
    type: string
    name: string
    description?: string
    icon: string
    action: () => void | Promise<void>
    requiresApp?: boolean
    codeName?: string
  }

  interface EnrichedCommand extends Command {
    searchValue: string
  }

  interface SearchResult extends EnrichedCommand {
    idx: number
  }

  type Category = [string, SearchResult[]]
  type CommandDatasource = Datasource | UIInternalDatasource

  $goto
  $isActive
  $params

  const modalContext = getContext<ModalAPI>(Context.Modal)

  let search = ""
  let selected: number | null = null
  let commands: Command[] = []
  let enrichedCommands: EnrichedCommand[] = []
  let results: SearchResult[] = []
  let categories: Category[] = []

  $: inApp = $isActive("/builder/workspace/:workspaceId")
  $: commands = [
    {
      type: "Access",
      name: "Invite users and manage app access",
      description: "",
      icon: "user",
      action: () => bb.settings("/people/workspace"),
      requiresApp: true,
    },
    ...navigationCommands(),
    {
      type: "Publish",
      name: "App",
      description: "Deploy your application",
      icon: "cube",
      action: deployApp,
      requiresApp: true,
    },
    {
      type: "Preview",
      name: "App",
      description: "",
      icon: "play",
      action: () => previewStore.showPreview(true),
      requiresApp: true,
    },
    {
      type: "Preview",
      name: "Published App",
      icon: "play",
      action: () => window.open(`/app${$workspaceStore.url}`),
      requiresApp: true,
    },
    {
      type: "Support",
      name: "Raise Github Discussion",
      icon: "question",
      action: () =>
        window.open(`https://github.com/Budibase/budibase/discussions/new`),
      requiresApp: true,
    },
    {
      type: "Support",
      name: "Raise A Bug",
      icon: "bug",
      action: () =>
        window.open(
          `https://github.com/Budibase/budibase/issues/new?assignees=&labels=bug&template=bug_report.md&title=`
        ),
      requiresApp: true,
    },
    ...datasourceCommands($datasources?.list || []),
    ...tableCommands($tables?.list || []),
    ...viewCommands($views?.list || []),
    ...viewV2Commands($viewsV2?.list || []),
    ...queryCommands($queries?.list || []),
    ...screenCommands($sortedScreens),
    ...automationCommands($automationStore?.automations || []),
    ...themeCommands(),
    ...featureFlagCommands($featureFlags),
  ]
  $: enrichedCommands = commands.map(
    (cmd): EnrichedCommand => ({
      ...cmd,
      searchValue: `${cmd.type} ${cmd.name} ${cmd.codeName || ""}`
        .toLowerCase()
        .replace(/_/g, " "),
    })
  )
  $: results = filterResults(enrichedCommands, search, inApp)
  $: categories = groupResults(results)

  const navigationCommands = () => {
    const routes = [
      {
        name: "Workspaces",
        url: BUILDER_URLS.WORKSPACES,
      },
      {
        name: "Home",
        url: "/builder/workspace/:workspaceId/home",
      },
      {
        name: "Data",
        url: "/builder/workspace/:workspaceId/data",
      },
      {
        name: "Apps",
        url: "/builder/workspace/:workspaceId/home?type=app",
      },
      {
        name: "Automations",
        url: "/builder/workspace/:workspaceId/home?type=automation",
      },
      {
        name: "Agents",
        url: "/builder/workspace/:workspaceId/home?type=agent",
      },
    ]
    return routes.map(route => ({
      type: "Navigate",
      name: route.name,
      icon: "compass",
      action: () => {
        const gotoParams = route.url.includes(":workspaceId")
          ? { workspaceId: $params.workspaceId }
          : {}
        $goto(route.url, gotoParams)
      },
      requiresApp: true,
    }))
  }

  const datasourceCommands = (
    datasourceList: CommandDatasource[]
  ): Command[] => {
    return datasourceList.map(datasource => ({
      type: "Datasource",
      name: datasource.name || "",
      icon:
        datasource.source === IntegrationTypes.REST
          ? "globe-simple"
          : "database",
      action: () =>
        $goto(
          datasource.source === IntegrationTypes.REST
            ? `/builder/workspace/:workspaceId/apis/datasource/:id`
            : `/builder/workspace/:workspaceId/data/datasource/:id`,
          {
            workspaceId: $params.workspaceId,
            id: datasource._id,
          }
        ),
      requiresApp: true,
    }))
  }

  const tableCommands = (tableList: Table[]): Command[] => {
    return tableList.map(table => ({
      type: "Table",
      name: table.name,
      icon: "table",
      action: () =>
        $goto(`/builder/workspace/:workspaceId/data/table/:id`, {
          workspaceId: $params.workspaceId,
          id: table._id,
        }),
      requiresApp: true,
    }))
  }

  const viewCommands = (viewList: View[]): Command[] => {
    return viewList.map(view => ({
      type: "View",
      name: view.name || "",
      icon: "minus",
      action: () => {
        $goto(`/builder/workspace/:workspaceId/data/view/:name`, {
          workspaceId: $params.workspaceId,
          name: view.name,
        })
      },
      requiresApp: true,
    }))
  }

  const viewV2Commands = (viewList: ViewV2[]): Command[] => {
    return viewList.map(view => ({
      type: "View",
      name: view.name,
      icon: "minus",
      action: () => {
        $goto(`/builder/workspace/:workspaceId/data/table/:tableId/:viewId`, {
          workspaceId: $params.workspaceId,
          x: view.tableId,
          viewId: view.id,
        })
      },
      requiresApp: true,
    }))
  }

  const queryCommands = (queryList: Query[]): Command[] => {
    const datasourceLookup = new Map(
      ($datasources.list || []).map(datasource => [datasource._id, datasource])
    )
    return queryList.map(query => {
      const datasource = datasourceLookup.get(query.datasourceId)
      const isRest = datasource?.source === IntegrationTypes.REST
      return {
        type: "Query",
        name: query.name,
        icon: isRest ? "globe-hemisphere-west" : "database",
        action: () =>
          $goto(
            isRest
              ? `/builder/workspace/:workspaceId/apis/query/:id`
              : `/builder/workspace/:workspaceId/data/query/:id`,
            {
              workspaceId: $params.workspaceId,
              id: query._id,
            }
          ),
        requiresApp: true,
      }
    })
  }

  const screenCommands = (screens: Screen[]): Command[] => {
    return screens.map(screen => ({
      type: "Screen",
      name: screen.routing.route,
      icon: "browser",
      action: () =>
        $goto(`/builder/workspace/:workspaceId/design/:screenId/:componentId`, {
          workspaceId: $params.workspaceId,
          screenId: screen._id,
          componentId: `${screen._id}-screen`,
        }),
      requiresApp: true,
    }))
  }

  const automationCommands = (automations: UIAutomation[]): Command[] => {
    return automations.map(automation => ({
      type: "Automation",
      name: automation.name,
      icon: "share-network",
      action: () =>
        $goto(`/builder/workspace/:workspaceId/automation/:id`, {
          workspaceId: $params.workspaceId,
          id: automation._id,
        }),
      requiresApp: true,
    }))
  }

  const themeCommands = (): Command[] => {
    return ThemeOptions.map(themeMeta => {
      const theme = themeMeta.id as Theme
      return {
        type: "Change Builder Theme",
        name: themeMeta.name,
        icon: "palette",
        action: () =>
          themeStore.update(state => {
            state.theme = theme
            return state
          }),
      }
    })
  }

  const featureFlagCommands = (flags: FeatureFlags): Command[] => {
    if (!flags.FEATURE_FLAG_OVERRIDES) {
      return []
    }
    return Object.entries(flags)
      .filter(([flag]) => flag !== FeatureFlag.FEATURE_FLAG_OVERRIDES)
      .map(([flag, value]) => {
        return {
          type: "Feature Flag",
          name: value ? "Disable" : "Enable",
          codeName: flag,
          icon: "flag",
          action: () => {
            featureFlags.setFlag(flag as FeatureFlag, !value)
          },
        }
      })
  }

  const filterResults = (
    commands: EnrichedCommand[],
    search: string,
    inApp: boolean
  ): SearchResult[] => {
    if (search) {
      selected = 0
      search = search.toLowerCase().replace(/_/g, " ")
    } else {
      selected = null
    }
    return commands
      .filter(cmd => {
        // Handle searching
        if (search && !cmd.searchValue.includes(search)) {
          return false
        }
        // Handle commands that require an app
        return inApp || !cmd.requiresApp
      })
      .map((cmd, idx) => ({
        ...cmd,
        idx,
      }))
  }

  const groupResults = (results: SearchResult[]): Category[] => {
    let categories: Record<string, SearchResult[]> = {}
    results?.forEach(result => {
      if (!categories[result.type]) {
        categories[result.type] = []
      }
      categories[result.type].push(result)
    })
    return Object.entries(categories)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (selected === null) {
        selected = 0
        return
      }
      if (selected < results.length - 1) {
        selected += 1
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (selected === null) {
        selected = results.length - 1
        return
      }
      if (selected > 0) {
        selected -= 1
      }
    } else if (e.key === "Enter") {
      if (selected == null) {
        return
      }
      runAction(results[selected])
    } else if (e.key === "Escape") {
      modalContext.hide()
    }
  }

  async function deployApp() {
    if (await deploymentStore.publishApp()) {
      notifications.success("App published successfully")
    }
  }

  const runAction = (command: Command | undefined) => {
    if (!command) {
      return
    }
    command.action()
    modalContext.hide()
  }
</script>

<svelte:window on:keydown={onKeyDown} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ModalContent
  size="L"
  showCancelButton={false}
  showConfirmButton={false}
  showCloseIcon={false}
>
  <div class="content">
    <div class="title">
      <Icon size="XL" name="magnifying-glass" />
      <Input bind:value={search} quiet placeholder="Search for command" />
    </div>
    <div class="commands">
      {#each categories as [name, results]}
        <div class="category">
          <Detail>{name}</Detail>
          <div class="options">
            {#each results as command}
              <div
                class="command"
                on:click={() => runAction(command)}
                class:selected={command.idx === selected}
              >
                <Icon size="M" name={command.icon} />
                <strong>{command.type}:&nbsp;</strong>
                <div class="name">
                  {command.name}
                  {#if command.codeName}
                    <code>{command.codeName}</code>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</ModalContent>

<style>
  .content {
    margin: -40px;
    overflow: hidden;
  }
  .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-l)
      var(--spacing-xl);
    border-bottom: var(--border-dark);
    gap: var(--spacing-m);
    border-bottom-width: 2px;
  }
  .title :global(.spectrum-Textfield-input) {
    border-bottom: none;
    font-size: 20px;
  }

  .commands {
    height: 378px;
    overflow: scroll;
  }

  .category {
    padding: var(--spacing-m) var(--spacing-xl);
    border-bottom: var(--border-light);
  }
  .category:last-of-type {
    border-bottom: none;
  }
  .category :global(.spectrum-Detail) {
    color: var(--spectrum-global-color-gray-600);
  }
  .options {
    padding-top: var(--spacing-m);
    margin: 0 calc(-1 * var(--spacing-xl));
  }

  .command {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: var(--spacing-s) var(--spacing-xl);
    cursor: pointer;
    overflow: hidden;
    transition:
      color 130ms ease-out,
      background-color 130ms ease-out;
  }
  .command:hover,
  .selected {
    color: var(--spectrum-global-color-gray-900);
    background-color: var(--spectrum-global-color-gray-300);
  }
  .command strong {
    margin-left: var(--spacing-m);
  }
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .name :global(code) {
    margin-left: 4px;
    font-size: 12px;
    background: var(--background-alt);
    padding: 4px;
    border-radius: 4px;
  }
</style>
