<script>
  import Shepherd from "shepherd.js"
  import { tourStore } from "builderStore"

  export let tour = new Shepherd.Tour()

  const steps = [
    {
      title: "Create a Table",
      text:
        "The first step to building your app is to define your data. A table is the basic building block of your database. Click the 'Create New Table' button to create a table. ",
      attachTo: {
        element: "#shep-builder-left-panel",
        on: "bottom",
      },
      buttons: [
        {
          text: "Close",
          action: tour.cancel,
        },
      ],
    },
    {
      title: "Setup Table",
      text:
        "After selecting to create a new table, you should set up your table here in the Setup Panel. In this panel, you can provide a name for your table by typing in the name of your table above.",
      attachTo: {
        element: "#shep-setup-tab",
        on: "bottom",
      },
      buttons: [
        {
          text: "Close",
          action: tour.cancel,
        },
      ],
    },
    {
      title: "Save your changes",
      text:
        "Once you have provided your table with a name. Click the 'Save' button to save your table.",
      attachTo: {
        element: "#shep-setup-save",
        on: "bottom",
      },
      buttons: [
        {
          text: "Close",
          action: tour.cancel,
        },
      ],
    },
    {
      title: "Click to Add Fields to your Table",
      text:
        "Click the 'Add' tab above to add fields to your newly created table.",
      attachTo: {
        element: "#shep-builder-left-panel",
        on: "bottom",
      },
      buttons: [
        {
          text: "Close",
          action: tour.cancel,
        },
      ],
    },
    {
      title: "Add Fields or Blocks to your Table",
      text:
        "Fields are always of a particular type. Select the field type you would like to add and provide the properties for the field in the right hand setup panel.",
      attachTo: {
        element: "#shep-builder-left-panel",
        on: "bottom",
      },
      buttons: [
        {
          text: "Close",
          action: tour.cancel,
        },
      ],
    },
    {
      title: "Click to view the frontend builder",
      text:
        "Once you have setup the backend of your application. Click the frontend tab to build out the frontend of your application.",
      attachTo: {
        element: "#shep-top-nav",
        on: "bottom",
      },
      buttons: [
        {
          text: "Close",
          action: tour.cancel,
        },
      ],
    },
    {
      title: "Start building the frontend of your web application",
      text:
        "Click the 'Create New Screen' button to start building your frontend screens. Add components to your screens and modify any styles in the right hand side panel.",
      attachTo: {
        element: "#shep-builder-left-panel",
        on: "right",
      },
      buttons: [
        {
          text: "Close",
          action: tour.cancel,
        },
      ],
    },
  ]

  tourStore.update(state => {
    state.tour = tour
    state.tour.addSteps(steps)
    return state
  })

  setTimeout(() => {
    console.log($tourStore.tour)
    $tourStore.tour.start()
  }, 500)
</script>
