<script>
  import {
    Context,
    Icon,
    Input,
    ModalContent,
    Detail,
    notifications,
  } from "@budibase/bbui"
  import { API } from "@/api"
  import { goto, params, isActive } from "@roxi/routify"
  import {
    automationStore,
    previewStore,
    builderStore,
    sortedScreens,
    appStore,
    datasources,
    queries,
    tables,
    views,
    viewsV2,
  } from "@/stores/builder"
  import { themeStore, featureFlags } from "@/stores/portal"
  import { getContext } from "svelte"
  import { ThemeOptions } from "@budibase/shared-core"
  import { FeatureFlag } from "@budibase/types"

  const modalContext = getContext(Context.Modal)

  let search
  let selected = null

  $: inApp = $isActive("/builder/workspace/:application")
  $: commands = [
    {
      type: "Access",
      name: "Invite users and manage app access",
      description: "",
      icon: "user",
      action: () => builderStore.showBuilderSidePanel(),
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
      action: () => window.open(`/app${$appStore.url}`),
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
  $: enrichedCommands = commands.map(cmd => ({
    ...cmd,
    searchValue: `${cmd.type} ${cmd.name}`.toLowerCase().replace(/_/g, " "),
  }))
  $: results = filterResults(enrichedCommands, search, inApp)
  $: categories = groupResults(results)

  const navigationCommands = () => {
    const routes = [
      {
        name: "Portal",
        url: "/builder/portal",
      },
      {
        name: "Data",
        url: "/builder/workspace/:application/data",
      },
      {
        name: "Design",
        url: "/builder/workspace/:application/design",
      },
      {
        name: "Automations",
        url: "/builder/workspace/:application/automation",
      },
      {
        name: "Settings",
        url: "/builder/workspace/:application/settings",
      },
    ]
    return routes.map(route => ({
      type: "Navigate",
      name: route.name,
      icon: "compass",
      action: () => {
        const gotoParams = route.url.includes(":application")
          ? { application: $params.application }
          : {}
        $goto(route.url, gotoParams)
      },
      requiresApp: true,
    }))
  }

  const datasourceCommands = datasources => {
    return datasources.map(datasource => ({
      type: "Datasource",
      name: datasource.name,
      icon: "database",
      action: () =>
        $goto(`/builder/workspace/:application/data/datasource/:id`, {
          application: $params.application,
          id: datasource._id,
        }),
      requiresApp: true,
    }))
  }

  const tableCommands = tables => {
    return tables.map(table => ({
      type: "Table",
      name: table.name,
      icon: "table",
      action: () =>
        $goto(`/builder/workspace/:application/data/table/:id`, {
          application: $params.application,
          id: table._id,
        }),
      requiresApp: true,
    }))
  }

  const viewCommands = views => {
    return views.map(view => ({
      type: "View",
      name: view.name,
      icon: "minus",
      action: () => {
        $goto(`/builder/workspace/:application/data/view/:name`, {
          application: $params.application,
          name: view.name,
        })
      },
      requiresApp: true,
    }))
  }

  const viewV2Commands = views => {
    return views.map(view => ({
      type: "View",
      name: view.name,
      icon: "minus",
      action: () => {
        $goto(`/builder/workspace/:application/data/table/:tableId/:viewId`, {
          application: $params.application,
          x: view.tableId,
          viewId: view.id,
        })
      },
      requiresApp: true,
    }))
  }

  const queryCommands = queries => {
    return queries.map(query => ({
      type: "Query",
      name: query.name,
      icon: "database",
      action: () =>
        $goto(`/builder/workspace/:application/data/query/:id`, {
          application: $params.application,
          id: query._id,
        }),
      requiresApp: true,
    }))
  }

  const screenCommands = screens => {
    return screens.map(screen => ({
      type: "Screen",
      name: screen.routing.route,
      icon: "browser",
      action: () =>
        $goto(`/builder/workspace/:application/design/:screenId/:componentId`, {
          application: $params.application,
          screenId: screen._id,
          componentId: `${screen._id}-screen`,
        }),
      requiresApp: true,
    }))
  }

  const automationCommands = automations => {
    return automations.map(automation => ({
      type: "Automation",
      name: automation.name,
      icon: "share-network",
      action: () =>
        $goto(`/builder/workspace/:application/automation/:id`, {
          application: $params.application,
          id: automation._id,
        }),
      requiresApp: true,
    }))
  }

  const themeCommands = () => {
    return ThemeOptions.map(themeMeta => ({
      type: "Change Builder Theme",
      name: themeMeta.name,
      icon: "palette",
      action: () =>
        themeStore.update(state => {
          state.theme = themeMeta.id
          return state
        }),
    }))
  }

  const featureFlagCommands = flags => {
    if (!flags.DEBUG_UI) {
      return []
    }
    return Object.entries(flags)
      .filter(([flag]) => flag !== FeatureFlag.DEBUG_UI)
      .map(([flag, value]) => ({
        type: "Feature Flag",
        name: `${value ? "Disable" : "Enable"} <code>${flag}</code>`,
        icon: "flag",
        action: () => {
          featureFlags.setFlag(flag, !value)
        },
      }))
  }

  const filterResults = (commands, search, inApp) => {
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

  const groupResults = results => {
    let categories = {}
    results?.forEach(result => {
      if (!categories[result.type]) {
        categories[result.type] = []
      }
      categories[result.type].push(result)
    })
    return Object.entries(categories)
  }

  const onKeyDown = e => {
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
    try {
      await API.publishAppChanges($appStore.appId)
      notifications.success("App published successfully")
    } catch (error) {
      notifications.error("Error publishing app")
    }
  }

  const runAction = command => {
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
                  <!--eslint-disable-next-line svelte/no-at-html-tags-->
                  {@html command.name}
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
    font-size: 12px;
    background: var(--background-alt);
    padding: 4px;
    border-radius: 4px;
  }
</style>
