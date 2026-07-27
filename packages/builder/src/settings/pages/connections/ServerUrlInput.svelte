<script lang="ts">
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import { clickOutside, Icon, Divider } from "@budibase/bbui"
  import type { OpenAPIServer } from "@budibase/types"

  export let value: string = ""
  export let label: string = "Base URL"
  export let servers: OpenAPIServer[] = []
  export let disabled: boolean = false
  export let error: string = ""

  const dispatch = createEventDispatcher()

  let open = false
  let focus = false
  let inputId = `server-url-${Math.random().toString(36).slice(2)}`

  const resolveWithDefaults = (server: OpenAPIServer) =>
    server.url.replace(
      /\{([^}]+)\}/g,
      (_, key) => server.variables?.[key]?.default ?? `{${key}}`
    )

  $: firstServerUrl =
    servers.length > 0
      ? resolveWithDefaults(servers[0])
      : "https://api.example.com"

  const selectServer = (server: OpenAPIServer) => {
    value = resolveWithDefaults(server)
    dispatch("change", value)
    open = false
    focus = false
  }

  const handleOutsideClick = (e: Event) => {
    if (open) {
      e.stopPropagation()
      open = false
      focus = false
    }
  }

  const openPopover = () => {
    open = true
    focus = true
  }
</script>

<div class="field">
  {#if label}
    <label for={inputId} class="spectrum-FieldLabel spectrum-FieldLabel--sizeM"
      >{label}</label
    >
  {/if}
  <div class="spectrum-InputGroup">
    <div
      class="spectrum-Textfield"
      class:is-focused={focus}
      class:is-disabled={disabled}
      class:is-invalid={!!error}
    >
      <div class="inline-icon">
        <Icon
          name="globe"
          hoverable={!disabled && servers.length > 0}
          disabled={disabled || servers.length === 0}
          on:click={() => !disabled && servers.length > 0 && openPopover()}
        />
      </div>
      <input
        id={inputId}
        class="spectrum-Textfield-input"
        type="text"
        {value}
        {disabled}
        on:input={e => {
          value = e.currentTarget.value
          dispatch("change", value)
        }}
        on:focus={() => (focus = true)}
        on:blur={() => {
          focus = false
          dispatch("blur")
        }}
        placeholder={firstServerUrl}
      />
    </div>

    {#if open && servers.length > 0}
      <div
        use:clickOutside={handleOutsideClick}
        class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
      >
        <ul class="spectrum-Menu" role="listbox">
          {#each servers as server, i}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
            <li
              class="spectrum-Menu-item"
              role="option"
              aria-selected="false"
              tabindex="0"
              on:click={() => selectServer(server)}
            >
              <div class="spectrum-Menu-itemLabel">
                <div class="server-label">
                  {server.description || `Server #${i + 1}`}
                </div>
                <div class="server-url">{resolveWithDefaults(server)}</div>
              </div>
            </li>
          {/each}
        </ul>
        <Divider noMargin />
        <div class="popover-footer">
          <Icon name="info" size="S" />
          <div class="footer-text">Pick a server to configure</div>
        </div>
      </div>
    {/if}
  </div>
  {#if error}
    <div class="error">{error}</div>
  {/if}
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .spectrum-Textfield {
    width: 100%;
  }

  .inline-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 6px;
  }

  .spectrum-InputGroup {
    min-width: 0;
    width: 100%;
    position: relative;
  }

  .spectrum-Popover {
    max-height: 240px;
    z-index: 999;
    top: 100%;
    position: absolute;
  }

  .spectrum-Popover.spectrum-Popover--bottom.spectrum-Picker-popover.is-open {
    width: 100%;
  }

  .server-label {
    font-weight: 600;
    font-size: var(--font-size-s);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .server-url {
    font-size: var(--font-size-xs);
    color: var(--spectrum-global-color-gray-600);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .popover-footer {
    display: flex;
    padding: var(--spacing-m) 0 var(--spacing-m) var(--spacing-m);
    align-items: center;
    gap: var(--spacing-s);
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
  }

  .footer-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .error {
    color: var(--spectrum-semantic-negative-color-default);
    font-size: var(--spectrum-global-dimension-font-size-75);
  }
</style>
