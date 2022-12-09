<script>
  import {
    ActionGroup,
    ActionButton,
    Context,
    Icon,
    Input,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import { API } from "api"
  import analytics, { Events } from "analytics"
  import { goto } from "@roxi/routify"
  import {
    store,
    sortedScreens,
    automationStore,
    themeStore,
  } from "builderStore"
  import { datasources, queries, tables, views } from "stores/backend"
  import { getContext } from "svelte"

  const modalContext = getContext(Context.Modal)

  const commands = [
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
      action: () => $goto("./automate"),
    },
    {
      type: "Preview",
      name: "App",
      description: "",
      icon: "Play",
      action: () => window.open(`/${$store.appId}`),
    },
    {
      type: "Preview",
      name: "Published App",
      icon: "Play",
      action: () => window.open(`/${$store.appId.replace("_dev", "")}`),
    },
    {
      type: "Publish",
      name: "App",
      description: "Deploy your application",
      icon: "Box",
      action: deployApp,
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
    ...$datasources?.list.map(datasource => ({
      type: "Datasource",
      name: `${datasource.name}`,
      icon: "Data",
      action: () => $goto(`./data/datasource/${datasource._id}`),
    })),
    ...$tables?.list.map(table => ({
      type: "Table",
      name: table.name,
      icon: "Table",
      action: () => $goto(`./data/table/${table._id}`),
    })),
    ...$views?.list.map(view => ({
      type: "View",
      name: view.name,
      icon: "Remove",
      action: () => $goto(`./data/view/${view.name}`),
    })),
    ...$queries?.list.map(query => ({
      type: "Query",
      name: query.name,
      icon: "SQLQuery",
      action: () => $goto(`./data/query/${query._id}`),
    })),
    ...$sortedScreens.map(screen => ({
      type: "Screen",
      name: screen.routing.route,
      icon: "WebPage",
      action: () => $goto(`./design/${screen._id}/components`),
    })),
    ...$automationStore?.automations.map(automation => ({
      type: "Automation",
      name: automation.name,
      icon: "ShareAndroid",
      action: () => $goto(`./automate/${automation._id}`),
    })),
    ...["lightest", "light", "dark", "darkest", "nord", "midnight"].map(
      theme => ({
        type: "Change Builder Theme",
        name: theme,
        icon: "ColorPalette",
        action: () =>
          themeStore.update(state => {
            state.theme = theme
            return state
          }),
      })
    ),
  ]

  let search
  let selected = null

  $: if (search) {
    selected = 0
  }

  $: results = commands.filter(
    command =>
      !search || new RegExp(search, "gi").test(command.type + command.name)
  )

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      if (selected === null) {
        selected = 0
        return
      }

      if (selected < results.length - 1) {
        selected += 1
      }
    }
    if (e.key === "ArrowUp") {
      if (selected === null) {
        selected = results.length - 1
        return
      }
      if (selected > 0) {
        selected -= 1
      }
    }
    if (e.key === "Enter") {
      runAction(results[selected || 0])
    }
  }

  async function deployApp() {
    try {
      await API.deployAppChanges()
      analytics.captureEvent(Events.APP.PUBLISHED, {
        appId: $store.appId,
      })
      notifications.success("Application published successfully")
    } catch (error) {
      analytics.captureException(error)
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

<ModalContent
  title="Command Palette"
  size="L"
  showCancelButton={false}
  showConfirmButton={false}
  showCloseIcon={false}
>
  <Input bind:value={search} placeholder={"Search for command..."} />
  <div class="options">
    {#each results as command, idx}
      <div
        class="command"
        on:click={() => runAction(command)}
        class:selected={idx === selected || results.length === 1}
      >
        <Icon size="M" name={command.icon} />
        <strong>{command.type}:&nbsp;</strong>
        <div class="name">
          {command.name}
        </div>
      </div>
    {/each}
  </div>
  <footer>
    <ActionGroup compact>
      <ActionButton icon="ChevronUpDown">Navigate</ActionButton>
      <ActionButton icon="Pivot">Select</ActionButton>
      <ActionButton icon="ChevronUp">Dismiss</ActionButton>
    </ActionGroup>
  </footer>
</ModalContent>

<style>
  .command {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: var(--spacing-m);
    cursor: pointer;
    overflow: hidden;
    border-radius: var(--border-radius-s);
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
  .options {
    height: 500px;
    overflow: scroll;
  }
  footer {
    display: flex;
    justify-content: center;
  }
</style>
