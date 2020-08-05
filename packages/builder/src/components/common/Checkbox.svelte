<script>
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let checked = false

  function handleChange() {
    checked = !checked
    dispatch("change", checked)
  }
</script>

<input type="checkbox" class="checkbox" id="_checkbox" />
<label for="_checkbox" class:checked on:click={handleChange}>
  <div class="tick_mark" />
</label>

<style>
  .checkbox {
    display: none;
  }

  label {
    position: relative;
    width: 20px;
    height: 20px;
    /* background-color: #5e17e9; */
    background-color: var(--grey-2);
    /* transform: translateY(-50%); */
    cursor: pointer;
    transition: 0.2s ease transform, 0.2s ease background-color,
      0.2s ease box-shadow;
    overflow: hidden;
    z-index: 1;
    border-radius: 4px;
  }

  label:before {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    width: 12px;
    height: 12px;
    margin: 0 auto;
    background-color: #fff;
    transform: translateY(-50%);
    transition: 0.2s ease width, 0.2s ease height;
    border-radius: 2px;
  }

  label:active {
    transform: translateY(-50%) scale(0.9);
  }

  .tick_mark {
    position: absolute;
    top: 50%;
    left: 6px;
    width: 5px;
    height: 4px;
    margin: 0 auto;
    transform: rotateZ(-40deg);
  }

  .tick_mark:before,
  .tick_mark:after {
    content: "";
    position: absolute;
    background-color: #000;
    border-radius: 2px;
    opacity: 0;
    transition: 0.2s ease transform, 0.2s ease opacity;
  }

  .tick_mark:before {
    left: 0;
    bottom: 0;
    width: 2px;
    height: 6px;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.23);
    transform: translateY(-68px);
  }

  .tick_mark:after {
    left: 0;
    bottom: 0;
    width: 12px;
    height: 2px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.23);
    transform: translateX(78px);
  }

  .checked {
    /* background-color: #5e17e9; */
    background-color: var(--grey-2);
    /* box-shadow: 0 7px 10px #5e17e9; */
  }

  .checked:before {
    width: 0;
    height: 0;
  }

  .checked .tick_mark:before,
  .checked .tick_mark:after {
    transform: translate(0);
    opacity: 1;
  }
</style>
