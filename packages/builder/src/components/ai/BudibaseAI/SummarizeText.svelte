<script>
  import { Button, TextArea, Body } from "@budibase/bbui"
  import { API } from "api"
  import Editor from "components/integration/QueryEditor.svelte"

  let prompt = ""
  let summary = ""

  async function summarizeText() {
    const aiResponse = await API.aiSummarizeText({ prompt, model: "ChatGPT" })
    summary = aiResponse.response
  }
</script>

<TextArea label="Text" bind:value={prompt} />
<Body>{summary}</Body>
<Button cta on:click={summarizeText}>Generate</Button>
