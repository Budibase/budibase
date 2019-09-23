import { writable } from "svelte/store";
import Login from "../Login.svelte";
import Grid from "../Grid.svelte";
import Form from "../Form.svelte";
import Textbox from "../Textbox.svelte";
import Text from "../Text.svelte";
import { createApp } from "@budibase/client/src/createApp";

export default async () =>  {

    const componentLibraries = {
        components : {
            login : Login,
            grid : Grid,
            form : Form,
            textbox : Textbox,
            text: Text
        }
    }
   
    return createApp(componentLibraries);

    const initialiseComponent = (props, htmlElement) => {

        new (components[props._component])({
            target: htmlElement,
            props: {...props, _app}
        });

    }

    const store = writable({});

    const _app = {
        initialiseComponent, 
        store
    };

    return _app;
}