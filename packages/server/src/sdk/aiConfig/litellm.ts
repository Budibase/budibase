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

async function getExistingModels(): Promise<string[]> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-1234",
    },
  }

  const response = await fetch("http://localhost:4000/models", requestOptions)

  const json = await response.json()
  return json.data.map((x: any) => x.id)
}

export async function addModelIfRequired(model: {
  name: string
  baseUrl: string
}) {
  const { name, baseUrl } = model
  const existingModels = await getExistingModels()
  if (existingModels.includes(name)) {
    return
  }
  const provider = name.split("/")[0]

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-1234",
    },
    body: JSON.stringify({
      model_name: name,
      litellm_params: {
        api_base: baseUrl,
        custom_llm_provider: provider,
        model: name,
        use_in_pass_through: false,
        use_litellm_proxy: false,
        merge_reasoning_content_in_choices: false,
        input_cost_per_token: 0,
        output_cost_per_token: 0,
        guardrails: [],
      },
    }),
  }

  const res = await fetch("http://localhost:4000/model/new", requestOptions)
  const text = await res.text()
  console.error(text)
}
