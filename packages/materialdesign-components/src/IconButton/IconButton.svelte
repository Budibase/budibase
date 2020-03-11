<script>
  import ripple from "../Common/Ripple.js"
  import ClassBuilder from "../ClassBuilder.js"

  const cb = new ClassBuilder("icon-button")

  export let _bb
  export let context = ""
  export let onClick = () => {}
  export let disabled = false
  export let href = ""
  export let icon = ""
  export let onIcon = "" //on state icon for toggle button
  export let size = "medium"

  $: isToggleButton = !!icon && !!onIcon
  $: useLinkButton = !!href

  $: customs = { size }
  $: props = { customs, extras: ["material-icons", context] }
  $: iconBtnClass = cb.build({ props })
</script>

{#if useLinkButton}
  <a on:click={onClick} class={iconBtnClass} {href} {disabled}>
    {#if isToggleButton}
      <i
        use:ripple
        class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">
        {onIcon}
      </i>
      <i use:ripple class="material-icons mdc-icon-button__icon">{icon}</i>
    {:else}{icon}{/if}
  </a>
{:else}
  <button
    on:click={onClick}
    class={iconBtnClass}
    {disabled}
    role="button"
    tabindex="0">
    {#if isToggleButton}
      <i
        use:ripple
        class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">
        {onIcon}
      </i>
      <i use:ripple class="material-icons mdc-icon-button__icon">{icon}</i>
    {:else}{icon}{/if}
  </button>
{/if}
