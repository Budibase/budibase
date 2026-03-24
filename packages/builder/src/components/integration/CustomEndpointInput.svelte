<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { clickOutside, Icon, ActionMenu, MenuItem } from "@budibase/bbui"
  import APIEndpointVerbBadge from "./APIEndpointVerbBadge.svelte"
  import { customQueryIconColor } from "@/helpers/data/utils"
  import { applyBaseUrl } from "./query"

  export let verb: string = "read"
  export let url: string = ""
  export let baseUrlOptions: { label: string; url: string }[] = []
  export let verbOptions: { value: string; label: string }[] = []
  export let disabled: boolean = false

  const dispatch = createEventDispatcher()

  let verbOpen = false
  let urlInputEl: HTMLInputElement

  $: verbColor = customQueryIconColor(verb)
  $: httpVerb = verbOptions.find(o => o.value === verb)?.label ?? verb

  const selectVerb = (value: string) => {
    verb = value
    dispatch("verbChange", value)
    verbOpen = false
    urlInputEl?.focus()
  }

  const selectBaseUrl = (newBase: string) => {
    url = applyBaseUrl(url, newBase)
    dispatch("urlChange", url)
    urlInputEl?.focus()
  }
</script>

<div
  class="input-wrap"
  class:is-disabled={disabled}
  use:clickOutside={() => {
    verbOpen = false
  }}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="verb-trigger"
    class:open={verbOpen}
    on:click={() => !disabled && (verbOpen = !verbOpen)}
    style:--verb-color={verbColor}
  >
    <APIEndpointVerbBadge verb={httpVerb} color={verbColor} />
    <Icon name={verbOpen ? "ChevronUp" : "ChevronDown"} size="S" />
  </div>

  <div class="divider"></div>

  <div class="url-section" class:has-globe={baseUrlOptions.length > 0}>
    <input
      bind:this={urlInputEl}
      class="url-input"
      type="text"
      value={url}
      placeholder="https://api.example.com/api/v1/endpoint"
      {disabled}
      on:input={e => {
        url = e.currentTarget.value
        dispatch("urlChange", url)
      }}
      on:keydown={e => {
        if (e.key === "Enter" && !e.isComposing) e.currentTarget.blur()
      }}
      on:blur={() => dispatch("urlCommit", url)}
    />
    {#if baseUrlOptions.length > 0}
      <div class="globe-icon">
        <ActionMenu align="right" {disabled}>
          <svelte:fragment slot="control">
            <Icon name="globe" size="S" hoverable={!disabled} />
          </svelte:fragment>
          <div class="url-menu-content">
            {#each baseUrlOptions as option}
              <MenuItem on:click={() => selectBaseUrl(option.url)}>
                <div class="url-option">
                  <span class="url-option-label">{option.label}</span>
                  <span class="url-option-url">{option.url}</span>
                </div>
              </MenuItem>
            {/each}
          </div>
        </ActionMenu>
      </div>
    {/if}
  </div>

  {#if verbOpen}
    <div class="dropdown verb-dropdown spectrum-Popover is-open">
      <ul class="spectrum-Menu" role="listbox">
        {#each verbOptions as option}
          <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <li
            class="spectrum-Menu-item"
            class:is-selected={option.value === verb}
            role="option"
            aria-selected={option.value === verb}
            on:click={() => selectVerb(option.value)}
          >
            <span class="spectrum-Menu-itemLabel">
              <APIEndpointVerbBadge
                verb={option.label}
                color={customQueryIconColor(option.value)}
              />
            </span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .input-wrap {
    display: flex;
    align-items: center;
    height: 40px;
    border: 1px solid var(--spectrum-alias-border-color);
    border-radius: var(--spectrum-alias-border-radius-regular);
    background: var(--spectrum-alias-background-color-default);
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
    container-type: inline-size;
    position: relative;
    transition: border-color 130ms ease-out;
  }
  .input-wrap:focus-within {
    border-color: var(--spectrum-alias-border-color-focus);
  }
  .input-wrap.is-disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  .verb-trigger {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: 0 var(--spacing-s) 0 var(--spacing-m);
    height: 100%;
    cursor: pointer;
    flex-shrink: 0;
    user-select: none;
    color: var(--spectrum-alias-text-color);
  }
  .verb-trigger:hover {
    background: var(--spectrum-global-color-gray-100);
    border-radius: var(--spectrum-alias-border-radius-regular) 0 0
      var(--spectrum-alias-border-radius-regular);
  }

  .divider {
    width: 1px;
    height: 60%;
    background: var(--spectrum-alias-border-color);
    flex-shrink: 0;
  }

  .url-section {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    position: relative;
    overflow: hidden;
    height: 100%;
  }

  .url-input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0 var(--spacing-m);
    font-family: var(--font-sans);
    font-size: var(--spectrum-alias-font-size-default);
    color: var(--spectrum-alias-text-color);
  }
  .url-input::placeholder {
    color: var(--spectrum-alias-text-color-disabled);
  }
  .url-section.has-globe .url-input {
    padding-right: 28px;
  }

  .globe-icon {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    color: var(--spectrum-alias-text-color);
  }

  .globe-icon::before {
    content: "";
    position: absolute;
    right: 100%;
    top: 0;
    width: 24px;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      var(--spectrum-alias-background-color-default)
    );
    pointer-events: none;
    transition: opacity 130ms ease-out;
  }
  .url-section:focus-within .globe-icon::before {
    opacity: 0;
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 4px);
    z-index: 999;
    background: var(--spectrum-alias-background-color-default);
    border: 1px solid var(--spectrum-alias-border-color);
    border-radius: var(--spectrum-alias-border-radius-regular);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    padding: var(--spacing-xs) 0;
  }

  .verb-dropdown {
    left: 0;
    width: fit-content;
  }

  .url-menu-content {
    min-width: 260px;
  }

  .url-option {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .url-option-label {
    font-size: var(--font-size-s);
    font-weight: 600;
    color: var(--spectrum-alias-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .url-option-url {
    font-size: var(--font-size-xs);
    color: var(--spectrum-global-color-gray-600);
    font-family: var(--font-mono);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
