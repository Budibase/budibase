<script lang="ts">
  import { Heading, Layout, Page, Icon, Tags, Tag } from "@budibase/bbui"
  import Chatbox from "./_agents/Chatbox.svelte"
  import BBAI from "@/components/common/Icons/BBAI.svelte"
  import { API } from "@/api"

  let textarea: any
  let inputValue = ""
  let loading: boolean = false

  let messages: { message: string, isSystem: boolean, isError?: boolean }[] = []

  function textChange() {
    textarea.height = "auto"
    textarea.height = textarea.scrollHeight + "px"
  }

  async function handleKeyDown(event: any) {
    if (event.key === "Enter" && !event.shiftKey) {
      await prompt()
    }
  }

  async function prompt() {
    messages.push({
      message: inputValue,
      isSystem: false,
    })
    messages = messages
    loading = true
    try {
      const res = await API.agentChat(inputValue)
      inputValue = ""
      messages.push({
        message: res.response,
        isSystem: true,
      })
    } catch (err: any) {
      messages.push({
        message: err.message,
        isSystem: true,
        isError: true,
      })
    }

    loading = false
    messages = messages
  }
</script>

<Page>
  <Layout noPadding gap="S">
    <div class="heading">
      <BBAI />
      <Heading size="L">Budibase Agents</Heading>
    </div>
    <div class="app-tags">
      <Tags>
        <Tag emphasized>Hello</Tag>
        <Tag emphasized>Hello</Tag>
        <Tag emphasized>Hello</Tag>
      </Tags>
      <Icon name="AddCircle" hoverable />
    </div>
    <div class="wrapper">
      <Chatbox bind:messages={messages}></Chatbox>
      <div class="input-container">
          <pre
            class="input"
            aria-hidden="true"
          >{inputValue + '\n'}</pre>
        <textarea bind:value={inputValue} bind:this={textarea} class="input spectrum-Textfield-input" on:input={textChange} on:keydown={handleKeyDown} />
        <div class="run-icon">
          {#if !loading}
            <Icon name="PlayCircle" size="XXL" hoverable on:click={prompt} />
          {:else}
            <BBAI size="36px" animate />
          {/if}
        </div>
      </div>
    </div>
  </Layout>
</Page>

<style>
  .heading {
    display: flex;
    align-items: center;
    gap: var(--spacing-l);
  }

  .app-tags {
    display: flex;
    gap: var(--spacing-l);
  }

  .wrapper {
    padding: 20px;
    border-radius: 20px;
    background-color: var(--grey-2);
  }

  .input-container {
    position: relative;
  }

  .input {
    font-size: 18px;
    background-color: var(--grey-3);
    color: var(--grey-9);
    border-radius: 20px;
    border: none;
    outline: none;
    resize: none;
    overflow: hidden;
    box-sizing: border-box;
    min-height: 100px;
    width: 100%;
    padding: 15px;
  }

  textarea {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    resize: none;
  }

  .run-icon {
    position: absolute;
    right: var(--spacing-xl);
    bottom: var(--spacing-xl);
  }
</style>