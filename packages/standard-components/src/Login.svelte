<script>

import Textbox from "./Textbox.svelte";
import Form from "./Form.svelte";
import Button from "./Button.svelte";

export let usernameLabel = "Username";
export let passwordLabel = "Password";
export let loginButtonLabel = "Login";
export let loginRedirect = "";
export let logo = "";
export let buttonClass = "";
export let inputClass=""

export let _bb;

let username = "";
let password = "";
let busy = false;
let incorrect = false;
let _logo = "";
let _buttonClass = "";
let _inputClass = "";

$: {
    _logo = _bb.relativeUrl(logo);
    _buttonClass = buttonClass || "default-button";
    _inputClass = inputClass || "default-input";
}

const login = () => {
    busy = true;
    _bb.api.post("/api/authenticate", {username, password})
    .then(r => {
        busy = false;
        if(r.status === 200) {
            return r.json();
        } else {
            incorrect = true;
            return;
        }
    })
    .then(user => {
        if(user) {
            localStorage.setItem("budibase:user", user);
            location.reload();
        }
    })
}

</script>

<div class="root">

    <div class="content">

        {#if _logo}
        <div class="logo-container">
            <img src={_logo} alt="logo"/>
        </div>
        {/if}

        <div class="form-root">
            <div class="label">
                {usernameLabel}
            </div>
            <div class="control">
                <input bind:value={username} type="text" class={_inputClass}/>
            </div>
            <div class="label">
                {passwordLabel}
            </div>
            <div class="control">
                <input bind:value={password} type="password" class={_inputClass}/>
            </div>
        </div>

        <div class="login-button-container">
            <button disabled={busy} 
                    on:click={login}
                    class={_buttonClass}>
                    {loginButtonLabel}
            </button>
        </div>

        {#if incorrect}
        <div class="incorrect-details-panel">
            Incorrect username or password
        </div>
        {/if}

    </div>

</div>

<style>

.root {
    height: 100%;
    display:grid;
    grid-template-columns: [left] 1fr [middle] auto [right] 1fr;
    grid-template-rows: [top] 1fr [center] auto [bottom] 1fr;
}

.content {
    grid-column-start: middle;
    grid-row-start: center;
    width: 400px;
}

.logo-container {
    margin-bottom: 20px
}

.logo-container > img {
    max-width: 100%;
}

.login-button-container {
    text-align: right;
    margin-top: 20px;
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
    display: grid;
    grid-template-columns: [label] auto [control] 1fr; /* [overflow] auto;*/
}

.label {
    grid-column-start: label;
    padding: 5px 10px;
    vertical-align: middle;
}
.control {
    grid-column-start: control;
    padding: 5px 10px;
}

.default-input {
	font-family: inherit;
	font-size: inherit;
	padding: 0.4em;
	margin: 0 0 0.5em 0;
	box-sizing: border-box;
	border: 1px solid #ccc;
    border-radius: 2px;
    width: 100%;
}

.default-button {
	font-family: inherit;
	font-size: inherit;
	padding: 0.4em;
	margin: 0 0 0.5em 0;
	box-sizing: border-box;
	border: 1px solid #ccc;
	border-radius: 2px;
	color: #333;
	background-color: #f4f4f4;
	outline: none;
}

.default-button:active {
	background-color: #ddd;
}

.default-button:focus {
	border-color: #666;
}

</style>