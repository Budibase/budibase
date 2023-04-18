<script>
  import { store, selectedScreen } from "builderStore"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"
  import { Layout, Button, Detail, notifications } from "@budibase/bbui"
  import Logo from "assets/bb-space-man.svg"
  import createFromScratchScreen from "builderStore/store/screenTemplates/createFromScratchScreen"
  import { Roles } from "constants/backend"

  import { _ } from "lang/i18n"

  let loaded = false

  const createFirstScreen = async () => {
    let screen = createFromScratchScreen.create()
    screen.routing.route = "/home"
    screen.routing.roldId = Roles.BASIC
    screen.routing.homeScreen = true
    try {
      const savedScreen = await store.actions.screens.save(screen)
      notifications.success(
        $_(
          "pages.builder.app.application.design.index.createFirstScreen.notiofications_success"
        )
      )
      $redirect(`./${savedScreen._id}`)
    } catch (err) {
      console.error(
        $_(
          "pages.builder.app.application.design.index.createFirstScreen.console_error"
        ),
        err
      )
      notifications.error(
        $_(
          "pages.builder.app.application.design.index.createFirstScreen.notiofications_error"
        )
      )
    }
  }

  onMount(() => {
    if ($selectedScreen) {
      $redirect(`./${$selectedScreen._id}`)
    } else if ($store.screens?.length) {
      $redirect(`./${$store.screens[0]._id}`)
    } else {
      loaded = true
    }
  })
</script>

{#if loaded}
  <div class="centered">
    <Layout gap="S" justifyItems="center">
      <img class="img-size" alt="logo" src={Logo} />
      <div class="new-screen-text">
        <Detail size="L"
          >{$_("pages.builder.app.application.design.index.Detail")}</Detail
        >
      </div>
      <Button on:click={createFirstScreen} size="M" cta icon="Add">
        {$_("pages.builder.app.application.design.index.Button")}
      </Button>
    </Layout>
  </div>
{/if}

<style>
  .centered {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
  .new-screen-text {
    width: 150px;
    text-align: center;
    font-weight: 600;
  }
  .img-size {
    width: 170px;
  }
</style>
