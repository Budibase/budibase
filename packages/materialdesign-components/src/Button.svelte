<script>
  import "@material/button/mdc-button.scss";
  import "@material/button/_mixins.scss";

  //TODO: How does theme color work for this?
  //TODO: Add action for ripple
  //TODO: Create class builder class or fn

  /* 
    ==BLOCK MODIFIERS==
    raised = via variant prop
    outlined = via variant prop
    unelevated = via variant prop
    touch = needs accessibility wrapper div
   */

  export let text = "";

  //Either raised,outlined or unelevated
  export let variant = "raised";
  export let colour = "primary";
  export let disabled = false; //added directly to button element (not in class)
  export let icon = "";
  export let trailingIcon = false;

  $: renderLeadingIcon = !!icon && !trailingIcon;
  $: renderTrailingIcon = !!icon && trailingIcon;
</script>

<button class="mdc-button" {disabled}>
  <div class="mdc-button__ripple" />
  {#if renderLeadingIcon}
    <i class="material-icons mdc-button__icon" aria-hidden="true">{icon}</i>
  {/if}
  <span class="mdc-button__label">{text}</span>
  {#if renderTrailingIcon}
    <i class="material-icons mdc-button__icon" aria-hidden="true">{icon}</i>
  {/if}
</button>
