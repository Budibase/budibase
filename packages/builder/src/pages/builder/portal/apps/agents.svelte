<script>
  import { Heading, Layout, Page, TextArea } from "@budibase/bbui"
  import Chatbox from "./_agents/Chatbox.svelte"

  const fakeMessages = [
    { message: "hello", isSystem: false },
    { message: "How are you today?", isSystem: true },
    { message: "Doing well, can you help me?", isSystem: false },
    { message: "Sure I can! Just tell me a little bit about the problem you have.", isSystem: true },
  ]
</script>

<Page>
  <Layout noPadding gap="L">
    <Heading size="L">Welcome to Budibase Agents</Heading>
    <Chatbox messages={fakeMessages}></Chatbox>
    <TextArea />
  </Layout>
</Page>