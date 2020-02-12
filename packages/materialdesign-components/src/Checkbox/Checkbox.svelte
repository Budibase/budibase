<script>
  import { onMount, onDestroy, getContext } from "svelte";
  import Formfield from "../Common/Formfield.svelte";
  import { fieldStore } from "../Common/FormfieldStore.js";
  import ClassBuilder from "../ClassBuilder.js";
  import { MDCCheckbox } from "@material/checkbox";

  export let id = "";
  export let label = "";
  export let disabled = false;
  export let alignEnd = false;
  export let indeterminate = false;

  let instance = null;
  let checkbox = null;

  onMount(() => {
    if (!!checkbox) {
      instance = new MDCCheckbox(checkbox);
      let fieldStore = getContext("BBMD:field-element");
      fieldStore.setInput(instance);
      instance.indeterminate = indeterminate;
    }
  });

  const cb = new ClassBuilder("checkbox");
  let modifiers = { disabled };
  let props = { modifiers };

  const blockClass = cb.build({ props });
</script>

<!-- TODO: Customizing Colour and Density - What level of customization for these things does Budibase need here? -->

<Formfield {label} {id} {alignEnd}>
  <div bind:this={checkbox} class={blockClass}>
    <input type="checkbox" class={cb.elem`native-control`} {id} {disabled} />
    <div class={cb.elem`background`}>
      <svg class={cb.elem`checkmark`} viewBox="0 0 24 24">
        <path
          class={cb.elem`checkmark-path`}
          fill="none"
          d="M1.73,12.91 8.1,19.28 22.79,4.59" />
      </svg>
      <div class={cb.elem`mixedmark`} />
    </div>
    <div class={cb.elem`ripple`} />
  </div>
</Formfield>
