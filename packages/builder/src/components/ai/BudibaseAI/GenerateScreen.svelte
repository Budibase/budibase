<script>
  import { Button, TextArea, Helpers, notifications } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { Screen } from "templates/Screen"
  import { Component } from "templates/Component"
  import { screenStore } from "stores/builder"
  import store from "./aiStore"
  import { API } from "api"

  let prompt = ""

  async function generateScreen() {
    notifications.info("Generating screen")
    const formFields = await API.aiGenerateScreen({ prompt, model: $store.model })

    const form = new Component("@budibase/standard-components/form")
    form._json._children = formFields

    const screen = new Screen()
      .route(`/${Helpers.uuid()}`)
      .addChild(form)
      .json()

    const savedScreen = await screenStore.saveScreen(screen)
    notifications.success("Screen saved")
    // navigate to that screen?
    $goto(`./design/${savedScreen._id}`)

  }
</script>

<TextArea label="Prompt" bind:value={prompt} />
<Button cta on:click={generateScreen}>Generate</Button>