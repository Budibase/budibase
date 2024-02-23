<script>
  import { Button, TextArea } from "@budibase/bbui"
  import { API } from "api"
  import Editor from "components/integration/QueryEditor.svelte"

  let prompt = ""
  let response = ""
</script>

<!--    editorHeight={height}-->
<!--    label={noLabel ? null : "Query"}-->
<TextArea bind:value={prompt} />
<Button type="cta">Generate</Button>