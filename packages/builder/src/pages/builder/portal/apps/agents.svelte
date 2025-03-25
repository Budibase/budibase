<script>
  import { Heading, Body, Layout, Page, Icon } from "@budibase/bbui"
  import Chatbox from "./_agents/Chatbox.svelte"
  import BBAI from "@/components/common/Icons/BBAI.svelte"

  let textarea
  let inputValue = ""

  const fakeMessages = [
    { message: "hello", isSystem: false },
    { message: "How are you today?", isSystem: true },
    { message: "Doing well, can you help me?", isSystem: false },
    { message: "Sure I can! Just tell me a little bit about the problem you have.", isSystem: true },
  ]

  function textChange() {
    textarea.height = "auto"
    textarea.height = textarea.scrollHeight + "px"
  }
</script>

<Page>
  <Layout noPadding gap="S">
    <div class="heading">
      <BBAI />
      <Heading size="L">Budibase Agents</Heading>
    </div>
    <div class="wrapper">
      <Chatbox messages={fakeMessages}></Chatbox>
      <div class="input-container">
          <pre
            class="input"
            aria-hidden="true"
          >{inputValue + '\n'}</pre>
        <textarea bind:value={inputValue} bind:this={textarea} class="input spectrum-Textfield-input" on:input={textChange}></textarea>
        <div class="run-icon">
          <Icon name="PlayCircle" size="XXL" hoverable />
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