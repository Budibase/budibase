<script>
  import { getContext } from "svelte"

  const { authStore, styleable } = getContext("app")

  export let buttonText = "Log In"
  export let logo = ""
  export let title = ""
  export let buttonClass = ""
  export let inputClass = ""
  export let styles

  let username = ""
  let password = ""
  let loading = false
  let error = false
  let _buttonClass = ""
  let _inputClass = ""

  $: {
    _buttonClass = buttonClass || "default-button"
    _inputClass = inputClass || "default-input"
  }

  const login = async () => {
    loading = true
    const success = await authStore.actions.logIn({ username, password })
    if (success) {
      location.reload()
    } else {
      error = true
    }
    loading = false
  }
</script>

<div class="root" use:styleable={styles}>
  <div class="content">
    {#if logo}
      <div class="logo-container"><img src={logo} alt="logo" /></div>
    {/if}

    {#if title}
      <h2 class="header-content">{title}</h2>
    {/if}

    <div class="form-root">
      <div class="control">
        <input
          bind:value={username}
          type="text"
          placeholder="Username"
          class={_inputClass} />
      </div>

      <div class="control">
        <input
          bind:value={password}
          type="password"
          placeholder="Password"
          class={_inputClass} />
      </div>

      <button disabled={loading} on:click={login} class={_buttonClass}>
        {buttonText || 'Log In'}
      </button>
    </div>

    {#if error}
      <div class="incorrect-details-panel">Incorrect username or password</div>
    {/if}
  </div>
</div>

<style>
  .root {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
  }

  .logo-container {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .logo-container > img {
    max-height: 80px;
    max-width: 200px;
    margin-bottom: 20px;
  }

  .header-content {
    font-family: Inter;
    font-weight: 700;
    color: #1f1f1f;
    font-size: 32px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-feature-settings: "case" "rlig" "calt" 0;
    margin: 0 0 20px 0;
  }

  .incorrect-details-panel {
    margin-top: 26px;
    padding: 10px;
    border-style: solid;
    border-width: 1px;
    border-color: maroon;
    border-radius: 4px;
    text-align: center;
    color: maroon;
    background-color: mistyrose;
    align-self: stretch;
  }

  .form-root {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 300px;
    margin: auto;
    gap: 8px;
  }

  .control {
    width: 100%;
  }

  .default-input {
    font-family: Inter;
    font-size: 14px;
    color: #393c44;
    padding: 2px 6px 2px 12px;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 0.5px solid #d8d8d8;
    border-radius: 4px;
    width: 100%;
    height: 40px;
    transition: border-color 100ms ease-in 0s;
    outline-color: #797979;
  }

  .default-button {
    font-family: Inter;
    font-size: 16px;
    padding: 0.4em;
    box-sizing: border-box;
    border-radius: 4px;
    color: white;
    background-color: #393c44;
    outline: none;
    width: 300px;
    height: 40px;
    cursor: pointer;
    transition: all 0.2s ease 0s;
    overflow: hidden;
    outline: none;
    user-select: none;
    white-space: nowrap;
    text-align: center;
  }

  .default-button:hover {
    background-color: white;
    border-color: #393c44;
    color: #393c44;
  }

  h2 {
    text-align: center;
    margin-bottom: 10px;
  }
</style>
