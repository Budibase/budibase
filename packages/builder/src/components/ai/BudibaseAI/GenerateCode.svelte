<script>
  import { Button, TextArea, MenuItem, Body } from "@budibase/bbui"
  import store from "./aiStore"
  import { API } from "api"

  let js = ""
  let prompt = ""

  async function generateCode() {
    const code = await API.aiGenerateCode({ prompt, model: $store.model })
    js = code.response
  }
</script>

<TextArea label="Prompt" bind:value={prompt} />
<Body>{js}</Body>
<Button cta on:click={generateCode}>Generate</Button>