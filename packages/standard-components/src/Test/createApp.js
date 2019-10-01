import { writable } from "svelte/store";
import Login from "../Login.svelte";
import Grid from "../Grid.svelte";
import Form from "../Form.svelte";
import Textbox from "../Textbox.svelte";
import Text from "../Text.svelte";
import Nav from "../Nav.svelte";
import Panel from "../Panel.svelte";
import StackPanel from "../StackPanel.svelte";
import Table from "../Table.svelte";
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
            panel: Panel,
            table: Table,
            stackpanel: StackPanel
        }
    }

    const appDef = {hierarchy:{}, actions:{}};
    const user = {name:"yeo", permissions:[]};
   
    var app = createApp(componentLibraries, appDef, user);
    app.store.update(s => {
        s.people = [
            {name:"bob", address: "123 Main Street", status: "Open"},
            {name:"poppy", address: "456 Side Road", status: "Closed"},
            {name:"Oscar", address: "678 Dodgy Alley", status: "Open"},
        ];
        return s;
    })

    return app;

}