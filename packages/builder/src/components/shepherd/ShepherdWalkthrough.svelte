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
        element: "#shep-create-new-table",
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
        "After selecting to create a new table, you should set up your table here in the Setup Panel. In this panel, you can provide a name for your table and import any CSV data to your table. Click the 'Save' button at the bottom to save changes.",
      attachTo: {
        element: "#shep-setup-tab",
        on: "bottom",
      },
      buttons: [
        {
          text: "Close",
          action: tour.cancel,
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    },
    {
      title: "Add Fields to your Table",
      text:
        "Click the 'Add' tab above to add fields to your newly created table. Fields are always of a particular type.",
      attachTo: {
        element: "#shep-create-new-table",
        on: "bottom",
      },
      buttons: [
        {
          text: "Close",
          action: tour.cancel,
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    },
    {
      title: "Create the Frontend of your application",
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
