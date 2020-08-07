import fetchBindableProperties from "../src/builderStore/fetchBindableProperties"
describe("fetch bindable properties", () => {

  it("should return bindable properties from screen components", () => {
    const result = fetchBindableProperties({
      componentInstanceId: "heading-id",
      ...testData()
    })
    const componentBinding = result.find(r => r.instance._id === "search-input-id" && r.type === "instance")
    expect(componentBinding).toBeDefined()
    expect(componentBinding.type).toBe("instance")
    expect(componentBinding.runtimeBinding).toBe("search-input-id.value")
  })

  it("should not return bindable components when not in their context", () => {
    const result = fetchBindableProperties({
      componentInstanceId: "heading-id",
      ...testData()
    })
    const componentBinding = result.find(r => r.instance._id === "list-item-input-id")
    expect(componentBinding).not.toBeDefined()
  })

  it("should return model schema, when inside a context", () => {
    const result = fetchBindableProperties({
      componentInstanceId: "list-item-input-id",
      ...testData()
    })
    const contextBindings = result.filter(r => r.instance._id === "list-id" && r.type==="context")
    expect(contextBindings.length).toBe(2)
    
    const namebinding = contextBindings.find(b => b.runtimeBinding === "data.name")
    expect(namebinding).toBeDefined()
    expect(namebinding.readableBinding).toBe("list-name.Test Model.name")
    
    const descriptionbinding = contextBindings.find(b => b.runtimeBinding === "data.description")
    expect(descriptionbinding).toBeDefined()
    expect(descriptionbinding.readableBinding).toBe("list-name.Test Model.description")
  })

  it("should return model schema, for grantparent context", () => {
    const result = fetchBindableProperties({
      componentInstanceId: "child-list-item-input-id",
      ...testData()
    })
    const contextBindings = result.filter(r => r.type==="context")
    expect(contextBindings.length).toBe(4)
    
    const namebinding_parent = contextBindings.find(b => b.runtimeBinding === "parent.data.name")
    expect(namebinding_parent).toBeDefined()
    expect(namebinding_parent.readableBinding).toBe("list-name.Test Model.name")
    
    const descriptionbinding_parent = contextBindings.find(b => b.runtimeBinding === "parent.data.description")
    expect(descriptionbinding_parent).toBeDefined()
    expect(descriptionbinding_parent.readableBinding).toBe("list-name.Test Model.description")
    
    const namebinding_own = contextBindings.find(b => b.runtimeBinding === "data.name")
    expect(namebinding_own).toBeDefined()
    expect(namebinding_own.readableBinding).toBe("child-list-name.Test Model.name")
    
    const descriptionbinding_own = contextBindings.find(b => b.runtimeBinding === "data.description")
    expect(descriptionbinding_own).toBeDefined()
    expect(descriptionbinding_own.readableBinding).toBe("child-list-name.Test Model.description")
  })

  it("should return bindable component props, from components in same context", () => {
    const result = fetchBindableProperties({
      componentInstanceId: "list-item-heading-id",
      ...testData()
    })
    const componentBinding = result.find(r => r.instance._id === "list-item-input-id" && r.type === "instance")
    expect(componentBinding).toBeDefined()
    expect(componentBinding.runtimeBinding).toBe("list-item-input-id.value")
  })

  it("should not return components from child context", () => {
    const result = fetchBindableProperties({
      componentInstanceId: "list-item-heading-id",
      ...testData()
    })
    const componentBinding = result.find(r => r.instance._id === "child-list-item-input-id" && r.type === "instance")
    expect(componentBinding).not.toBeDefined()
  })
  
  it("should return bindable component props, from components in same context (when nested context)", () => {
    const result = fetchBindableProperties({
      componentInstanceId: "child-list-item-heading-id",
      ...testData()
    })
    const componentBinding = result.find(r => r.instance._id === "child-list-item-input-id" && r.type === "instance")
    expect(componentBinding).toBeDefined()
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
            },
            {
              _id: "list-item-input-id",
              _instanceName: "List Item Input",
              _component: "@budibase/standard-components/input",
              value: "list item"
            },
            {
              _id: "child-list-id",
              _component: "@budibase/standard-components/list",
              _instanceName: "child-list-name",
              model: "test-model-id",
              _children: [
                {
                  _id: "child-list-item-heading-id",
                  _instanceName: "child list item heading",
                  _component: "@budibase/standard-components/heading",
                  text: "hello"
                },
                {
                  _id: "child-list-item-input-id",
                  _instanceName: "Child List Item Input",
                  _component: "@budibase/standard-components/input",
                  value: "child list item"
                },
              ]
            },
          ]
        },
      ]
    }
  }

  const models = [{
    _id: "test-model-id",
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