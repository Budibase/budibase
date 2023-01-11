import { API } from "api"

export const getAPIKey = async () => {
  const { apiKey } = await API.fetchDeveloperInfo()
  return apiKey
}
