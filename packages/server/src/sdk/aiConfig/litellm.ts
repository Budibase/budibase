import fetch from "node-fetch"

export async function generateKey(name: string) {
  const body = JSON.stringify({
    key_alias: name,
  })

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-1234",
    },
    body,
  }

  const response = await fetch(
    "http://localhost:4000/key/generate",
    requestOptions
  )

  const json = await response.json()
  return json.token
}

export async function updateKey(key: string, name: string) {
  const body = JSON.stringify({
    key,
    key_alias: name,
  })

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-1234",
    },
    body,
  }

  const response = await fetch(
    "http://localhost:4000/key/update",
    requestOptions
  )

  const json = await response.json()
  return json.token
}

export async function removeKey(key: string) {
  const body = JSON.stringify({
    keys: [key],
  })

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-1234",
    },
    body,
  }

  const response = await fetch(
    "http://localhost:4000/key/delete",
    requestOptions
  )

  const json = await response.json()
  return json.token
}

export async function addModel() {
  const body = JSON.stringify({
    key_alias: name,
  })

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-1234",
    },
    body,
  }

  const response = await fetch(
    "http://localhost:4000/model/new",
    requestOptions
  )

  const json = await response.json()
  return json.token
}
