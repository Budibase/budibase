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
  import { goto } from "@roxi/routify"
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
  } from "@/stores/builder"
  import { themeStore } from "@/stores/portal"
  import { getContext } from "svelte"
  import { ThemeOptions } from "@budibase/shared-core"

  const modalContext = getContext(Context.Modal)
  const commands = [
    {
      type: "Access",
      name: "Invite users and manage app access",
      description: "",
      icon: "User",
      action: () => builderStore.showBuilderSidePanel(),
    },
    {
      type: "Navigate",
      name: "Portal",
      description: "",
      icon: "Compass",
      action: () => $goto("../../portal"),
    },
    {
      type: "Navigate",
      name: "Data",
      description: "",
      icon: "Compass",
      action: () => $goto("./data"),
    },
    {
      type: "Navigate",
      name: "Design",
      description: "",
      icon: "Compass",
      action: () => $goto("./design"),
    },
    {
      type: "Navigate",
      name: "Automations",
      description: "",
      icon: "Compass",
      action: () => $goto("./automation"),
    },
    {
      type: "Publish",
      name: "App",
      description: "Deploy your application",
      icon: "Box",
      action: deployApp,
    },
    {
      type: "Preview",
      name: "App",
      description: "",
      icon: "Play",
      action: () => previewStore.showPreview(true),
    },
    {
      type: "Preview",
      name: "Published App",
      icon: "Play",
      action: () => window.open(`/app${$appStore.url}`),
    },
    {
      type: "Support",
      name: "Raise Github Discussion",
      icon: "Help",
      action: () =>
        window.open(`https://github.com/Budibase/budibase/discussions/new`),
    },
    {
      type: "Support",
      name: "Raise A Bug",
      icon: "Bug",
      action: () =>
        window.open(
          `https://github.com/Budibase/budibase/issues/new?assignees=&labels=bug&template=bug_report.md&title=`
        ),
    },
    ...($datasources?.list?.map(datasource => ({
      type: "Datasource",
      name: `${datasource.name}`,
      icon: "Data",
      action: () => $goto(`./data/datasource/${datasource._id}`),
    })) ?? []),
    ...($tables?.list?.map(table => ({
      type: "Table",
      name: table.name,
      icon: "Table",
      action: () => $goto(`./data/table/${table._id}`),
    })) ?? []),
    ...($views?.list?.map(view => ({
      type: "View",
      name: view.name,
      icon: "Remove",
      action: () => {
        if (view.version === 2) {
          $goto(`./data/view/v2/${view.id}`)
        } else {
          $goto(`./data/view/${view.name}`)
        }
      },
    })) ?? []),
    ...($queries?.list?.map(query => ({
      type: "Query",
      name: query.name,
      icon: "SQLQuery",
      action: () => $goto(`./data/query/${query._id}`),
    })) ?? []),
    ...$sortedScreens.map(screen => ({
      type: "Screen",
      name: screen.routing.route,
      icon: "WebPage",
      action: () => {
        $goto(`./design/${screen._id}/${screen._id}-screen`)
      },
    })),
    ...($automationStore?.automations?.map(automation => ({
      type: "Automation",
      name: automation.name,
      icon: "ShareAndroid",
      action: () => $goto(`./automation/${automation._id}`),
    })) ?? []),
    ...ThemeOptions.map(themeMeta => ({
      type: "Change Builder Theme",
      name: themeMeta.name,
      icon: "ColorPalette",
      action: () =>
        themeStore.update(state => {
          state.theme = themeMeta.id
          return state
        }),
    })),
  ]

  let search
  let selected = null

  $: enrichedCommands = commands.map(cmd => ({
    ...cmd,
    searchValue: `${cmd.type} ${cmd.name}`.toLowerCase(),
  }))
  $: results = filterResults(enrichedCommands, search)
  $: categories = groupResults(results)

  const filterResults = (commands, search) => {
    if (!search) {
      selected = null
      return commands
    }
    selected = 0
    search = search.toLowerCase()
    return commands
      .filter(cmd => cmd.searchValue.includes(search))
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
      <Icon size="XL" name="Search" />
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
    transition: color 130ms ease-out, background-color 130ms ease-out;
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
</style>
