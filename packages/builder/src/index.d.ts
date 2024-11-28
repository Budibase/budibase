declare module "api" {
  const API: {
    getPlugins: () => Promise<any>
    createPlugin: (plugin: object) => Promise<any>
    uploadPlugin: (plugin: FormData) => Promise<any>
    deletePlugin: (id: string) => Promise<void>
  }
}
