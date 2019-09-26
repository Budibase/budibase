import { writable } from "svelte/store";
import Login from "../Login.svelte";
import Grid from "../Grid.svelte";
import Form from "../Form.svelte";
import Textbox from "../Textbox.svelte";
import Text from "../Text.svelte";
import Nav from "../Nav.svelte";
import Panel from "../Panel.svelte";
import { createApp } from "@budibase/client/src/createApp";

export default async () =>  {

    const componentLibraries = {
        components : {
            login : Login,
            grid : Grid,
            form : Form,
            textbox : Textbox,
            text: Text,
            nav: Nav,
            panel: Panel
        }
    }

    const appDef = {hierarchy:{}, actions:{}};
    const user = {name:"yeo", permissions:[]};
   
    return createApp(componentLibraries, appDef, user);

}