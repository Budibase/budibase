import { writable } from "svelte/store"
import Login from "../Login.svelte"
import Input from "../Input.svelte"
import Text from "../Text.svelte"
import Nav from "../Nav.svelte"
import H1 from "../H1.svelte"
import Div from "../Div.svelte"
import Table from "../Table.svelte"
import Button from "../Button.svelte"
import { createApp } from "@budibase/client/src/createApp"

export default async () => {
  const componentLibraries = {
    components: {
      login: Login,
      input: Input,
      text: Text,
      nav: Nav,
      table: Table,
      button: Button,
      div: Div,
      h1: H1,
    },
  }

  const appDef = { hierarchy: {}, actions: {} }
  const user = { name: "yeo", permissions: [] }

  var app = createApp(componentLibraries, appDef, user)
  app.store.update(s => {
    s.people = [
      { name: "bob", address: "123 Main Street", status: "Open" },
      { name: "poppy", address: "456 Side Road", status: "Closed" },
      { name: "Oscar", address: "678 Dodgy Alley", status: "Open" },
    ]
    return s
  })

  return app
}
