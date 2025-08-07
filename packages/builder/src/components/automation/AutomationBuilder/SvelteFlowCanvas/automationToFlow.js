import dagre from "@dagrejs/dagre"
import { AutomationActionStepId } from "@budibase/types"

const NODE_WIDTH = 250
const NODE_HEIGHT = 80
const BRANCH_NODE_HEIGHT = 120
const LOOP_NODE_HEIGHT = 100

/**
 * Convert automation structure to Svelte Flow nodes and edges
 * @param {Object} automation - The automation object
 * @returns {Object} - Object containing nodes and edges arrays
 */
export const convertAutomationToFlow = automation => {
  if (!automation?.definition) {
    return { nodes: [], edges: [] }
  }

  const nodes = []
  const edges = []
  const { trigger, steps } = automation.definition

  // Add trigger node
  if (trigger) {
    nodes.push({
      id: trigger.id || "trigger",
      type: "trigger",
      position: { x: 0, y: 0 },
      data: {
        ...trigger,
        id: trigger.id || "trigger",
        type: "TRIGGER", // FlowItem expects this
        label: trigger.name || "Trigger",
        stepId: trigger.stepId,
        inputs: trigger.inputs || {},
      },
    })
  }

  // Process steps recursively
  if (steps && steps.length > 0) {
    const processedSteps = processSteps(steps, trigger?.id || "trigger")
    nodes.push(...processedSteps.nodes)
    edges.push(...processedSteps.edges)
  }

  // Apply automatic layout
  const layoutedElements = getLayoutedElements(nodes, edges)

  return {
    nodes: layoutedElements.nodes,
    edges: layoutedElements.edges,
  }
}

/**
 * Process automation steps recursively to handle branches and loops
 * @param {Array} steps - Array of automation steps
 * @param {string} parentId - ID of the parent node
 * @param {string} branchId - ID of the branch (for branch children)
 * @returns {Object} - Object containing processed nodes and edges
 */
const processSteps = (steps, parentId, branchId = null) => {
  const nodes = []
  const edges = []
  let previousNodeId = parentId

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const nodeId = step.id || `step-${i}`

    // Determine node type based on stepId
    let nodeType = "action"

    if (step.stepId === AutomationActionStepId.BRANCH) {
      nodeType = "branch"
    } else if (step.stepId === AutomationActionStepId.LOOP) {
      nodeType = "loop"
    }

    // Create node
    const node = {
      id: nodeId,
      type: nodeType,
      position: { x: 0, y: 0 },
      data: {
        ...step,
        id: nodeId,
        type: "ACTION", // FlowItem expects this
        label: step.name || getStepLabel(step.stepId),
        stepId: step.stepId,
        inputs: step.inputs || {},
        branchId: branchId,
      },
    }

    nodes.push(node)

    // Create edge from previous node
    if (previousNodeId) {
      edges.push({
        id: `${previousNodeId}-${nodeId}`,
        source: previousNodeId,
        target: nodeId,
      })
    }

    // Handle branch children
    if (
      step.stepId === AutomationActionStepId.BRANCH &&
      step.inputs?.children
    ) {
      const branchChildren = step.inputs.children
      const branches = step.inputs.branches || []

      branches.forEach((branch, _branchIndex) => {
        const branchSteps = branchChildren[branch.id] || []
        if (branchSteps.length > 0) {
          const childResults = processSteps(branchSteps, nodeId, branch.id)
          nodes.push(...childResults.nodes)
          edges.push(...childResults.edges)
        }
      })
    }

    // Handle loop block reference
    if (step.stepId === AutomationActionStepId.LOOP && step.blockToLoop) {
      // Find the step that should be looped
      const loopTarget = steps.find(s => s.id === step.blockToLoop)
      if (loopTarget) {
        // Add a loop-back edge
        edges.push({
          id: `${nodeId}-loop-${step.blockToLoop}`,
          source: nodeId,
          target: step.blockToLoop,
          animated: true,
          style: {
            stroke: "var(--spectrum-global-color-blue-400)",
          },
        })
      }
    }

    previousNodeId = nodeId
  }

  return { nodes, edges }
}

/**
 * Get a readable label for a step based on its stepId
 * @param {string} stepId - The step ID
 * @returns {string} - Human readable label
 */
const getStepLabel = stepId => {
  const labelMap = {
    [AutomationActionStepId.CREATE_ROW]: "Create Row",
    [AutomationActionStepId.UPDATE_ROW]: "Update Row",
    [AutomationActionStepId.DELETE_ROW]: "Delete Row",
    [AutomationActionStepId.EXECUTE_QUERY]: "Execute Query",
    [AutomationActionStepId.SEND_EMAIL_SMTP]: "Send Email",
    [AutomationActionStepId.OUTGOING_WEBHOOK]: "Webhook",
    [AutomationActionStepId.EXECUTE_SCRIPT]: "Execute Script",
    [AutomationActionStepId.SERVER_LOG]: "Server Log",
    [AutomationActionStepId.DELAY]: "Delay",
    [AutomationActionStepId.FILTER]: "Filter",
    [AutomationActionStepId.API_REQUEST]: "API Request",
    [AutomationActionStepId.QUERY_ROWS]: "Query Rows",
    [AutomationActionStepId.LOOP]: "Loop",
    [AutomationActionStepId.BRANCH]: "Branch",
    [AutomationActionStepId.COLLECT]: "Collect",
  }

  return labelMap[stepId] || stepId
}

/**
 * Apply dagre layout algorithm to position nodes automatically
 * @param {Array} nodes - Array of nodes
 * @param {Array} edges - Array of edges
 * @returns {Object} - Object with positioned nodes and edges
 */
const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({
    rankdir: "TB", // Top to Bottom
    align: "UL", // Upper Left
    nodesep: 50, // Horizontal spacing between nodes
    ranksep: 80, // Vertical spacing between ranks
    marginx: 20,
    marginy: 20,
  })

  // Add nodes to dagre graph
  nodes.forEach(node => {
    let width = NODE_WIDTH
    let height = NODE_HEIGHT

    if (node.type === "branch") {
      height = BRANCH_NODE_HEIGHT
    } else if (node.type === "loop") {
      height = LOOP_NODE_HEIGHT
    }

    dagreGraph.setNode(node.id, { width, height })
  })

  // Add edges to dagre graph
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // Calculate layout
  dagre.layout(dagreGraph)

  // Apply positions to nodes
  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}
