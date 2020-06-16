import Workflow from "../Workflow";
import TEST_WORKFLOW from "./testWorkflow";

const TEST_BLOCK = {
  id: "VFWeZcIPx",
  name: "Update UI State",
  tagline: "Update <b>{{path}}</b> to <b>{{value}}</b>",
  icon: "ri-refresh-line",
  description: "Update your User Interface with some data.",
  environment: "CLIENT",
  params: {
    path: "string",
    value: "longText",
  },
  args: {
    path: "foo",
    value: "started...",
  },
  actionId: "SET_STATE",
  type: "ACTION",
}

describe("Workflow Data Object", () => {
  let workflow

  beforeEach(() => {
    workflow = new Workflow({ ...TEST_WORKFLOW });
  });

  it("adds a workflow block to the workflow", () => {
    workflow.addBlock(TEST_BLOCK);
    expect(workflow.workflow.definition)
  })

  it("updates a workflow block with new attributes", () => {
    const firstBlock = workflow.workflow.definition.steps[0];
    const updatedBlock = {
      ...firstBlock,
      name: "UPDATED"
    };
    workflow.updateBlock(updatedBlock, firstBlock.id);
    expect(workflow.workflow.definition.steps[0]).toEqual(updatedBlock)
  })

  it("deletes a workflow block successfully", () => {
    const { steps } = workflow.workflow.definition
    const originalLength = steps.length 

    const lastBlock = steps[steps.length - 1];
    workflow.deleteBlock(lastBlock.id);
    expect(workflow.workflow.definition.steps.length).toBeLessThan(originalLength);
  })

  it("builds a tree that gets rendered in the flowchart builder", () => {
    expect(Workflow.buildUiTree(TEST_WORKFLOW.definition)).toMatchSnapshot();
  })
})
