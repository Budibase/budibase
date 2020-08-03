import fetchbindableProperties from "../src/builderStore/fetchBindableProperties"

describe("fetch bindable properties", () => {

  it("should return bindable properties from screen components", () => {
    const result = fetchbindableProperties({
      componentInstanceId: "heading-id",
      ...testData()
    })
    const componentBinding = result.find(r => r.instance._id === "search-input-id")
    expect(componentBinding).toBeDefined()
    expect(componentBinding.type).toBe("instance")
    expect(componentBinding.runtimeBinding).toBe("state.search-input-id.value")
  })

  it("should not return bindable components when not in their context", () => {

  })

  it("should return model schema, when inside a context", () => {

  })

  it("should return model schema, for grantparent context", () => {

  })

  it("should return bindable component props, from components in same context", () => {

  })

  it("should not return model props from child context", () => {

  })

  

})

const testData = () => {

  const screen = {
    instanceName: "test screen",
    name: "screen-id",
    route: "/",
    props: {
      _id:"screent-root-id", 
      _component: "@budibase/standard-components/container",
      _children: [
        {
          _id: "heading-id",
          _instanceName: "list item heading",
          _component: "@budibase/standard-components/heading",
          text: "Screen Title"
        },
        {
          _id: "search-input-id",
          _instanceName: "Search Input",
          _component: "@budibase/standard-components/input",
          value: "search phrase"
        },
        {
          _id: "list-id",
          _component: "@budibase/standard-components/list",
          _instanceName: "list-name",
          model: "test-model-id",
          _children: [
            {
              _id: "list-item-heading-id",
              _instanceName: "list item heading",
              _component: "@budibase/standard-components/heading",
              text: "hello"
            }
          ]
        },
      ]
    }
  }

  const models = [{
    id: "test-model-id",
    name: "Test Model",
      schema: {
        name: {
          type: "string"
        },
        description: {
          type: "string"
        }
    }
  }]

  const components = {
    "@budibase/standard-components/container" : {
      props: {},
    },
    "@budibase/standard-components/list" : {
      context: "model",
      props: {
        model: "string"
      },
    },
    "@budibase/standard-components/input" : {
      bindable: "value",
      props: {
        value: "string"
      },
    },
    "@budibase/standard-components/heading" : {
      props: {
        text: "string"
      },
    },
  }

  return { screen, models, components }

}