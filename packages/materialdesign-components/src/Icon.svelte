<script>
  import { getContext } from "svelte";

  export let icon = "";

  let iconContext = getContext("BBMD:icon:context");
  let cls =
    iconContext == "button"
      ? "material-icons mdc-button__icon"
      : "material-icons";
</script>

<i class={cls}>{icon}</i>
