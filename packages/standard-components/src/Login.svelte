<script>
  import Button from "./Button.svelte"

  export let loginButtonLabel = "Login"
  export let logo = ""
  export let name = ""
  export let buttonClass = ""
  export let inputClass = ""

  export let _bb

  let username = ""
  let password = ""
  let loading = false
  let error = false
  let _logo = ""
  let _buttonClass = ""
  let _inputClass = ""

  $: {
    _logo = _bb.relativeUrl(logo)
    _buttonClass = buttonClass || "default-button"
    _inputClass = inputClass || "default-input"
  }

  const login = async () => {
    loading = true
    const response = await _bb.api.post("/api/authenticate", {
      username,
      password,
    })

    if (response.status === 200) {
      const json = await response.json()
      localStorage.setItem("budibase:token", json.token)
      // TODO: possibly do something with the user information in the response?
      location.reload()
    } else {
      loading = false
      error = true
    }
  }
</script>

<div class="root">
  <div class="content">
    {#if _logo}
      <div class="logo-container">
        <img src={_logo} alt="logo" />
      </div>
    {/if}

    <h1 class="header-content">Log in to {name}</h1>

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
    </div>

    <div class="login-button-container">
      <button disabled={loading} on:click={login} class={_buttonClass}>
        {loginButtonLabel}
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
    align-items: center;
    justify-content: center;
  }

  .logo-container {
    margin-bottom: 20px;
  }

  .logo-container > img {
    max-width: 100%;
  }

  .login-button-container {
    margin-top: 6px;
    max-width: 100%;
  }

  .header-content {
    font-family: Inter;
    font-weight: 700;
    color: #1f1f1f;
    font-size: 48px;
    line-height: 72px;
    margin-bottom: 30px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-feature-settings: "case" "rlig" "calt" 0;
  }

  .incorrect-details-panel {
    margin-top: 30px;
    padding: 10px;
    border-style: solid;
    border-width: 1px;
    border-color: maroon;
    border-radius: 1px;
    text-align: center;
    color: maroon;
    background-color: mistyrose;
  }

  .form-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
  }

  .control {
    padding: 6px 0px;
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
</style>
