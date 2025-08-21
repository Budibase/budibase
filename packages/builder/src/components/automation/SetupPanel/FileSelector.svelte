<script lang="ts">
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import { Toggle } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import {
    DrawerBindableInput,
    ServerBindingPanel as AutomationBindingPanel,
  } from "@/components/common/bindings"
  import { type KeyValuePair } from "@/types/automations"

  export let useAttachmentBinding
  export let buttonText
  export let key
  export let context
  export let value
  export let bindings

  const dispatch = createEventDispatcher()

  interface Attachment {
    filename: string
    url: string
  }

  const handleAttachmentParams = (keyValueObj: Attachment[]) => {
    let params: Record<string, string> = {}
    if (keyValueObj?.length) {
      for (let param of keyValueObj) {
        params[param.url] = param.filename
      }
    }
    return params
  }

  const handleKeyValueChange = (e: CustomEvent<KeyValuePair[]>) => {
    const update = {
      [key]: e.detail.map(({ name, value }) => ({
        url: name,
        filename: value,
      })),
    }

    dispatch("change", update)
  }
</script>

<div class="attachment-field-wrapper">
  <div class="toggle-container">
    <Toggle
      value={useAttachmentBinding}
      text={"Use bindings"}
      on:change={e => {
        dispatch("change", {
          [key]: null,
          meta: {
            useAttachmentBinding: e.detail,
          },
        })
      }}
    />
  </div>

  <div class="attachment-field-width">
    {#if !useAttachmentBinding}
      {#key value}
        <KeyValueBuilder
          on:change={handleKeyValueChange}
          object={handleAttachmentParams(value)}
          allowJS
          {bindings}
          keyBindings
          customButtonText={buttonText}
          keyPlaceholder={"URL"}
          valuePlaceholder={"Filename"}
          {context}
        />
      {/key}
    {:else}
      <DrawerBindableInput
        panel={AutomationBindingPanel}
        {value}
        on:change={e => dispatch("change", { [key]: e.detail })}
        {bindings}
        updateOnChange={false}
        {context}
      />
    {/if}
  </div>
</div>
