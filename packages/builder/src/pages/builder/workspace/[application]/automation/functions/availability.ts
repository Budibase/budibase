export type FunctionAvailability =
  | "unknown"
  | "checking"
  | "available"
  | "unavailable"
  | "error"

interface FunctionClientGate {
  featureEnabled: boolean
  cloud: boolean
}

export const isFunctionClientGateOpen = ({
  featureEnabled,
  cloud,
}: FunctionClientGate) => featureEnabled && !cloud

export const canAccessFunctions = (
  gate: FunctionClientGate & { serverAvailable: boolean }
) => isFunctionClientGateOpen(gate) && gate.serverAvailable
