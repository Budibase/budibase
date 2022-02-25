<script>
  import {
    ActionGroup,
    ActionButton,
    Body,
    Icon,
    Input,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import { API } from "api"
  import analytics, { Events } from "analytics"
  import { goto } from "@roxi/routify"
  import { store, allScreens, automationStore } from "builderStore"
  import { datasources, queries } from "stores/backend"
  import { themeStore } from "../../builderStore"

  export let close
  export let previewApp

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
      action: previewApp,
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
      name: "Published App",
      icon: "Play",
      action: () => window.open(`/${$store.appId.replace("_dev", "")}`),
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
      type: "Data",
      name: `${datasource.name}`,
      icon: "Data",
      action: () => $goto(`./data/datasource/${datasource._id}`),
    })),
    ...$allScreens.map(screen => ({
      type: "Screen",
      name: screen.routing.route,
      icon: "FullScreen",
      action: () => $goto(`./design/screen/${screen._id}`),
    })),
    ...$automationStore?.automations.map(automation => ({
      type: "Automation",
      name: automation.name,
      icon: "ShareAndroid",
      action: () => $goto(`./automate/${automation._id}`),
    })),
    ...["lightest", "light", "dark", "darkest"].map(theme => ({
      type: "Change Builder Theme",
      name: theme,
      icon: "ColorPalette",
      action: () =>
        themeStore.update(state => {
          state.theme = theme
          return state
        }),
    })),
    ...$queries?.list.map(query => ({
      type: "Query",
      name: query.name,
      icon: "SQLQuery",
      action: () =>
        $goto(`./data/datasource/${query.datasourceId}/${query._id}`),
    })),
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
      results[selected || 0].action()
      close()
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
      <span
        class="command"
        on:click={command.action}
        class:selected={idx === selected || results.length === 1}
      >
        <Icon size="M" name={command.icon} />
        <Body size="S"><strong>{command.type}:</strong> {command.name}</Body>
      </span>
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
    display: grid;
    grid-template-columns: 5% 40% 1fr;
    padding: 10px;
    cursor: pointer;
  }

  .options {
    height: 500px;
    overflow: scroll;
  }

  footer {
    display: flex;
    justify-content: center;
  }

  .command:hover {
    display: grid;
    grid-template-columns: 5% 1fr;
    color: var(--spectrum-global-color-gray-900);
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-global-color-gray-500);
  }

  .selected {
    color: var(--spectrum-global-color-gray-900);
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-global-color-gray-500);
    cursor: pointer;
  }
</style>
