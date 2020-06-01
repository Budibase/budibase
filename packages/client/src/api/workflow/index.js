import Orchestrator, { clientStrategy } from "./orchestrator"

export const triggerWorkflow = api => ({ workflow }) => {
  const workflowOrchestrator = new Orchestrator(
    api,
    "inst_ad75c7f_4f3e7d5d80a74b17a5187a18e2aba85e"
  )
  workflowOrchestrator.strategy = clientStrategy

  workflowOrchestrator.execute(workflow)
}
