exports.getFetchResponse = async fetched => {
  let status = fetched.status,
    message
  const contentType = fetched.headers.get("content-type")
  try {
    if (contentType && contentType.indexOf("application/json") !== -1) {
      message = await fetched.json()
    } else {
      message = await fetched.text()
    }
  } catch (err) {
    message = "Failed to retrieve response"
  }
  if (typeof message !== "string") {
    message = JSON.stringify(message)
  }
  return { status, message }
}
