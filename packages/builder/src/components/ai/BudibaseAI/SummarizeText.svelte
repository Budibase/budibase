<script>
  import { Button, TextArea, Body, notifications, Helpers } from "@budibase/bbui"
  import store from "./aiStore"
  import { API } from "api"

  let prompt = ""
  let summary = ""

  async function summarizeText() {
    const aiResponse = await API.aiSummarizeText({ prompt, model: $store.model })
    summary = aiResponse.response
    await Helpers.copyToClipboard(summary)
    notifications.success("Copied summary to clipboard")
  }
</script>

<TextArea label="Text" bind:value={prompt} />
<Body>{summary}</Body>
<Button cta on:click={summarizeText}>Generate</Button>
