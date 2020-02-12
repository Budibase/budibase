<script>
  import "@material/form-field/mdc-form-field.scss";
  import ClassBuilder from "../ClassBuilder.js";
  import { fieldStore } from "./FormfieldStore.js";
  import { MDCFormField } from "@material/form-field";
  import { onMount, onDestroy, setContext } from "svelte";

  const cb = new ClassBuilder("form-field");

  let store;
  const unsubscribe = fieldStore.subscribe(s => (store = s));

  export let id = "";
  export let label = "";
  export let alignEnd = false;

  let formField = null;

  let modifiers = { alignEnd };
  let props = { modifiers };

  let blockClasses = cb.build({ props });

  onMount(() => {
    if (!!formField) fieldStore.set(new MDCFormField(formField));
    setContext("BBMD:field-element", fieldStore);
  });

  onDestroy(unsubscribe);
</script>

<div bind:this={formField} class={blockClasses}>
  <slot />
  <label for={id}>{label}</label>
</div>
