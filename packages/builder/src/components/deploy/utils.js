export const DeploymentStatus = {
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILURE: "FAILURE",
}

// Required to check any updated deployment statuses between polls
export function checkIncomingDeploymentStatus(current, incoming) {
  return incoming.reduce((acc, incomingDeployment) => {
    if (incomingDeployment.status === DeploymentStatus.FAILURE) {
      const currentDeployment = current.find(
        deployment => deployment._id === incomingDeployment._id
      )

      //We have just been notified of an ongoing deployments failure
      if (
        !currentDeployment ||
        currentDeployment.status === DeploymentStatus.PENDING
      ) {
        acc.push(incomingDeployment)
      }
    }
    return acc
  }, [])
}
