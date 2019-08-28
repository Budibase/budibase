<script>

import Textbox from "./Textbox.svelte";
import FormControl from "./FormControl.svelte";
import Form from "./Form.svelte";
import Button from "./Button.svelte";

export let usernameLabel = "Username";
export let passwordLabel = "Password";
export let loginButtonLabel = "Login";
export let loginRedirect = "";
export let logo = "/budibase-logo.png";

let username = "";
let password = "";

</script>

<div class="root">

    <div class="content">

        <div class="logo-container">
            <img src={logo} alt="logo"/>
        </div>

        <Form>
            <FormControl label={usernameLabel}>
                <Textbox bind:value={username} />
            </FormControl>
            <FormControl label={passwordLabel}>
                <Textbox bind:value={password} hideValue=true />
            </FormControl>
        </Form>

        <div class="login-button-container">
            <Button>{loginButtonLabel}</Button>
        </div>

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

</style>