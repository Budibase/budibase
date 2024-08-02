export const buildMediaEndpoints = API => {
  return {
    uploadTentantMedia: async ({ data }) => {
      return await API.post({
        url: `/api/global/assets/upload`,
        body: data,
        json: false,
      })
    },

    deleteTentantMedia: async filename => {
      return await API.delete({
        url: `/api/global/assets/${filename}`,
      })
    },

    fetchTenantMedia: async () => {
      return await API.get({
        url: `/api/global/assets`,
      })
    },
  }
}
