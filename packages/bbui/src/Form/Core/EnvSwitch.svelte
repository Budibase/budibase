<script>
  import "@spectrum-css/switch/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = false
  export let id = null
  export let text = null //= "Some optional text"
  export let disabled = false

  let left = "Dev"
  let right = "Prod"
  let yes = false

  const dispatch = createEventDispatcher()
  const onChange = event => {
    console.log("toggled", event.target.checked)
    yes = event.target.checked
    dispatch("change", event.target.checked)
  }
</script>

<div class="input-wrap">
  <div class="env-input">
    <input
      checked={value}
      {disabled}
      on:change={onChange}
      on:click
      {id}
      type="checkbox"
      class="env-switch-input"
    />
    <span class="env-switch" class:toggled={yes}>
      <span class="left option">{left}</span>
      <span class="right option">{right}</span>
      <span class="toggle" />
    </span>
  </div>
  {#if text}
    <label class="spectrum-Switch-label" for={id}>{text}</label>
  {/if}
</div>

<style>
  .input-wrap {
    display: inline-flex;
    align-items: center;
    gap: var(
      --spectrum-switch-m-text-gap,
      var(--spectrum-alias-item-control-gap-m)
    );
  }
  .env-input {
    position: relative;
    width: 104px;
    /* display: inline-flex; */
  }
  .env-switch-input {
    opacity: 0;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    opacity: 0.0001;
    z-index: 3;
    cursor: pointer;
  }
  .option {
    z-index: 2;
  }
  .left.option {
    padding-left: 12px;
  }
  .env-switch.toggled .right,
  .env-switch .left {
    color: #efefef;
    transition: color 260ms ease-in-out;
  }
  .env-switch.toggled .left {
    color: #c8c8c8;
  }
  .toggle {
    box-shadow: 0 0 1px 0px #6e57ff inset, 0 0 1px 0px #6e57ff;
    cursor: pointer;
    background-color: #1d1d1d;
    position: absolute;
    width: 46px;
    height: 24px;
    border-radius: 16px;
    border: 1px solid #6e57ff;
    z-index: 1;
    transition: border 130ms ease-in-out, transform 130ms ease-in-out,
      box-shadow 130ms ease-in-out;
  }
  .env-switch {
    padding: 4px;
    gap: 24px;
    display: flex;
    background-color: #2c2c2c;
    align-items: center;
    height: 24px;
    border-radius: 18px;
  }
  .env-switch.toggled {
    background-color: #2c2c2c;
  }
  .env-switch.toggled .toggle {
    transform: translateX(48px);
    border-color: #ff4e4e;
    box-shadow: 0 0 1px 0px #ff4e4e inset, 0 0 1px 0px #ff4e4e;
  }
</style>
