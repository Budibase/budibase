<script>
  import {
    DrawerContent,
    Tabs,
    Tab,
    Body,
    Button,
    ActionButton,
    Heading,
    Icon,
  } from "@budibase/bbui"
  import { createEventDispatcher, onMount } from "svelte"
  import {
    isValid,
    decodeJSBinding,
    encodeJSBinding,
  } from "@budibase/string-templates"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"

  import { convertToJS } from "@budibase/string-templates"
  import { admin } from "stores/portal"
  import CodeEditor from "../CodeEditor/CodeEditor.svelte"
  import {
    getHelperCompletions,
    jsAutocomplete,
    hbAutocomplete,
    EditorModes,
    bindingsToCompletions,
    hbInsert,
    jsInsert,
  } from "../CodeEditor"
  import { getContext } from "svelte"
  import BindingPicker from "./BindingPicker.svelte"

  const dispatch = createEventDispatcher()

  export let bindings
  // jsValue/hbsValue are the state of the value that is being built
  // within this binding panel - the value should not be updated until
  // the binding panel is saved. This is the default value of the
  // expression when the binding panel is opened, but shouldn't be updated.
  export let value = ""
  export let valid
  export let allowJS = false
  export let allowHelpers = true

  const drawerActions = getContext("drawer-actions")
  const bindingDrawerActions = getContext("binding-drawer-actions")

  let getCaretPosition
  let insertAtPos
  let initialValueJS = typeof value === "string" && value?.startsWith("{{ js ")
  let mode = initialValueJS ? "JavaScript" : "Text"
  let jsValue = initialValueJS ? value : null
  let hbsValue = initialValueJS ? null : value
  let sidebar = true
  let targetMode = null

  $: usingJS = mode === "JavaScript"
  $: editorMode = mode == "JavaScript" ? EditorModes.JS : EditorModes.Handlebars
  $: bindingCompletions = bindingsToCompletions(bindings, editorMode)

  const updateValue = val => {
    valid = isValid(readableToRuntimeBinding(bindings, val))
    if (valid) {
      dispatch("change", val)
    }
  }

  // Adds a JS/HBS helper to the expression
  const onSelectHelper = (helper, js) => {
    const pos = getCaretPosition()
    const { start, end } = pos
    if (js) {
      let js = decodeJSBinding(jsValue)
      const insertVal = jsInsert(js, start, end, helper.text, { helper: true })
      insertAtPos({ start, end, value: insertVal })
    } else {
      const insertVal = hbInsert(hbsValue, start, end, helper.text)
      insertAtPos({ start, end, value: insertVal })
    }
  }

  // Adds a data binding to the expression
  const onSelectBinding = (binding, { forceJS } = {}) => {
    const { start, end } = getCaretPosition()
    if (usingJS || forceJS) {
      let js = decodeJSBinding(jsValue)
      const insertVal = jsInsert(js, start, end, binding.readableBinding)
      insertAtPos({ start, end, value: insertVal })
    } else {
      const insertVal = hbInsert(hbsValue, start, end, binding.readableBinding)
      insertAtPos({ start, end, value: insertVal })
    }
  }

  const onChangeMode = e => {
    mode = e.detail
    updateValue(mode === "JavaScript" ? jsValue : hbsValue)
  }

  const onChangeHBSValue = e => {
    hbsValue = e.detail
    updateValue(hbsValue)
  }

  const onChangeJSValue = e => {
    jsValue = encodeJSBinding(e.detail)
    updateValue(jsValue)
  }

  const switchMode = () => {
    if (targetMode == "Text") {
      jsValue = null
      updateValue(jsValue)
    } else {
      hbsValue = null
      updateValue(hbsValue)
    }
    mode = targetMode + ""
    targetMode = null
  }

  const convert = () => {
    const runtime = readableToRuntimeBinding(bindings, hbsValue)
    const runtimeJs = encodeJSBinding(convertToJS(runtime))
    jsValue = runtimeToReadableBinding(bindings, runtimeJs)
    hbsValue = null
    mode = "JavaScript"
    onSelectBinding("", { forceJS: true })
  }

  onMount(() => {
    valid = isValid(readableToRuntimeBinding(bindings, value))
  })
</script>

<span class="binding-drawer">
  <DrawerContent>
    <div class="main">
      <Tabs
        selected={mode}
        on:select={onChangeMode}
        beforeSwitch={selectedMode => {
          if (selectedMode == mode) {
            return true
          }

          //Get the current mode value
          const editorValue = usingJS ? decodeJSBinding(jsValue) : hbsValue

          if (editorValue) {
            targetMode = selectedMode
            return false
          }
          return true
        }}
      >
        <Tab title="Text">
          <div class="main-content" class:binding-panel={sidebar}>
            <div class="editor">
              <div class="overlay-wrap">
                {#if targetMode}
                  <div class="mode-overlay">
                    <div class="prompt-body">
                      <Heading size="S">
                        {`Switch to ${targetMode}?`}
                      </Heading>
                      <Body>This will discard anything in your binding</Body>
                      <div class="switch-actions">
                        <Button
                          secondary
                          size="S"
                          on:click={() => {
                            targetMode = null
                          }}
                        >
                          No - keep text
                        </Button>
                        <Button cta size="S" on:click={switchMode}>
                          Yes - discard text
                        </Button>
                      </div>
                    </div>
                  </div>
                {/if}
                <CodeEditor
                  value={hbsValue}
                  on:change={onChangeHBSValue}
                  bind:getCaretPosition
                  bind:insertAtPos
                  completions={[
                    hbAutocomplete([
                      ...bindingCompletions,
                      ...getHelperCompletions(editorMode),
                    ]),
                  ]}
                  placeholder=""
                  height="100%"
                />
              </div>
              <div class="binding-footer">
                <div class="messaging">
                  {#if !valid}
                    <div class="syntax-error">
                      Current Handlebars syntax is invalid, please check the
                      guide
                      <a href="https://handlebarsjs.com/guide/" target="_blank"
                        >here</a
                      >
                      for more details.
                    </div>
                  {:else}
                    <Icon name="FlashOn" />
                    <div class="messaging-wrap">
                      <div>
                        Add available bindings by typing &#123;&#123; or use the
                        menu on the right
                      </div>
                    </div>
                  {/if}
                </div>
                <div class="actions">
                  {#if $admin.isDev && allowJS}
                    <ActionButton
                      secondary
                      on:click={() => {
                        convert()
                        targetMode = null
                      }}
                    >
                      Convert To JS
                    </ActionButton>
                  {/if}
                  <ActionButton
                    secondary
                    icon={sidebar ? "RailRightClose" : "RailRightOpen"}
                    on:click={() => {
                      sidebar = !sidebar
                    }}
                  />
                </div>
              </div>
            </div>

            {#if sidebar}
              <div class="binding-picker">
                <BindingPicker
                  {bindings}
                  {allowHelpers}
                  addHelper={onSelectHelper}
                  addBinding={onSelectBinding}
                  mode={editorMode}
                />
              </div>
            {/if}
          </div>
        </Tab>
        {#if allowJS}
          <Tab title="JavaScript">
            <div class="main-content" class:binding-panel={sidebar}>
              <div class="editor">
                <div class="overlay-wrap">
                  {#if targetMode}
                    <div class="mode-overlay">
                      <div class="prompt-body">
                        <Heading size="S">
                          {`Switch to ${targetMode}?`}
                        </Heading>
                        <Body>This will discard anything in your binding</Body>
                        <div class="switch-actions">
                          <Button
                            secondary
                            size="S"
                            on:click={() => {
                              targetMode = null
                            }}
                          >
                            No - keep javascript
                          </Button>
                          <Button cta size="S" on:click={switchMode}>
                            Yes - discard javascript
                          </Button>
                        </div>
                      </div>
                    </div>
                  {/if}

                  <CodeEditor
                    value={decodeJSBinding(jsValue)}
                    on:change={onChangeJSValue}
                    completions={[
                      jsAutocomplete([
                        ...bindingCompletions,
                        ...getHelperCompletions(editorMode),
                      ]),
                    ]}
                    mode={EditorModes.JS}
                    bind:getCaretPosition
                    bind:insertAtPos
                    height="100%"
                  />
                </div>
                <div class="binding-footer">
                  <div class="messaging">
                    <Icon name="FlashOn" />
                    <div class="messaging-wrap">
                      <div>
                        Add available bindings by typing $ or use the menu on
                        the right
                      </div>
                    </div>
                  </div>
                  <div class="actions">
                    <ActionButton
                      secondary
                      icon={sidebar ? "RailRightClose" : "RailRightOpen"}
                      on:click={() => {
                        sidebar = !sidebar
                      }}
                    />
                  </div>
                </div>
              </div>

              {#if sidebar}
                <div class="binding-picker">
                  <BindingPicker
                    {bindings}
                    {allowHelpers}
                    addHelper={onSelectHelper}
                    addBinding={onSelectBinding}
                    mode={editorMode}
                  />
                </div>
              {/if}
            </div>
          </Tab>
        {/if}
        <div class="drawer-actions">
          {#if typeof drawerActions?.hide === "function" && drawerActions?.headless}
            <Button
              secondary
              quiet
              on:click={() => {
                drawerActions.hide()
              }}
            >
              Cancel
            </Button>
          {/if}
          {#if typeof bindingDrawerActions?.save === "function" && drawerActions?.headless}
            <Button
              cta
              disabled={!valid}
              on:click={() => {
                bindingDrawerActions.save()
              }}
            >
              Save
            </Button>
          {/if}
        </div>
      </Tabs>
    </div>
  </DrawerContent>
</span>

<style>
  .binding-drawer :global(.container > .main) {
    overflow: hidden;
    height: 100%;
    padding: 0px;
  }

  .binding-drawer :global(.container > .main > .main) {
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .binding-drawer :global(.spectrum-Tabs-content) {
    flex: 1;
    overflow: hidden;
  }

  .binding-drawer :global(.spectrum-Tabs-content > div),
  .binding-drawer :global(.spectrum-Tabs-content > div > div),
  .binding-drawer :global(.spectrum-Tabs-content .main-content) {
    height: 100%;
  }

  .binding-drawer .main-content {
    grid-template-rows: unset;
  }

  .messaging {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    min-width: 0;
    flex: 1;
  }
  .messaging-wrap {
    overflow: hidden;
  }
  .messaging-wrap > div {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .main :global(textarea) {
    min-height: 202px !important;
  }

  .main-content {
    padding: var(--spacing-s) var(--spacing-xl);
  }

  .main :global(.spectrum-Tabs div.drawer-actions) {
    display: flex;
    gap: var(--spacing-m);
    margin-left: auto;
  }

  .main :global(.spectrum-Tabs-content),
  .main :global(.spectrum-Tabs-content .main-content) {
    margin-top: 0px;
    padding: 0px;
  }

  .main :global(.spectrum-Tabs) {
    display: flex;
  }

  .syntax-error {
    color: var(--red);
    font-size: 12px;
  }
  .syntax-error a {
    color: var(--red);
    text-decoration: underline;
  }

  .binding-footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .main-content {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 380px;
  }
  .main-content.binding-panel {
    grid-template-columns: 1fr 320px;
  }
  .binding-picker {
    border-left: 2px solid var(--border-light);
    border-left: var(--border-light);
    overflow: scroll;
    height: 100%;
  }
  .editor {
    padding: var(--spacing-xl);
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    overflow: hidden;
  }
  .overlay-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
  }
  .mode-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
    border-radius: var(--border-radius-s);
  }
  .prompt-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-l);
  }
  .prompt-body .switch-actions {
    display: flex;
    gap: var(--spacing-l);
  }

  .binding-drawer :global(.code-editor),
  .binding-drawer :global(.code-editor > div) {
    height: 100%;
  }
</style>
