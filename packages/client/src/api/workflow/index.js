import Orchestrator, { clientStrategy } from "./orchestrator";


export const triggerWorkflow = api => ({ workflow }) => {
  console.log(workflow);
  const workflowOrchestrator = new Orchestrator(
    api,
    "inst_60dd510_700f7dc06735403e81d5af91072d7241"
  );
  workflowOrchestrator.strategy = clientStrategy

  workflowOrchestrator.execute(workflow);

  // hit the API and get the workflow data back

}