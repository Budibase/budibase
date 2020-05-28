export default async function() {
  const response = await fetch("www.google.com")
  console.log(response)
  console.log("CUSTOM ACTION")
  return {
    message: "CUSTOM_WORKFLOW_SCRIPT",
    response,
  }
}
