export function is409Error(error: any) {
  if (typeof error === "object") {
    return error.status === 409 || error.message?.includes("409")
  } else if (typeof error === "number") {
    return error === 409
  } else if (typeof error === "string") {
    return error.includes("409")
  }
}
