<script>
  import ripple from "../Ripple.js";
  import ClassBuilder from "../ClassBuilder.js";

  const cb = new ClassBuilder("icon-button");

  export let onClick = () => {};
  export let disabled = false;
  export let href = "";
  export let icon = "";
  export let onIcon = ""; //on state icon for toggle button
  export let size = "medium";

  $: isToggleButton = !!icon && !!onIcon;
  $: useLinkButton = !!href;

  $: customs = { size };
  $: props = { customs, extras: ["material-icons"] };
  $: iconBtnClass = cb.build({ props });
</script>

{#if useLinkButton}
  <a on:click={onClick} class={iconBtnClass} {href} {disabled}>
    {#if isToggleButton}
      <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">
        {onIcon}
      </i>
      <i class="material-icons mdc-icon-button__icon">{icon}</i>
    {:else}{icon}{/if}
  </a>
{:else}
  <button on:click={onClick} use:ripple class={iconBtnClass} {disabled}>
    {#if isToggleButton}
      <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">
        {onIcon}
      </i>
      <i class="material-icons mdc-icon-button__icon">{icon}</i>
    {:else}{icon}{/if}
  </button>
{/if}
