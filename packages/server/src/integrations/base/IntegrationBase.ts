export interface IntegrationBase {
  create?(query: any): Promise<any[]>
  read?(query: any): Promise<any[]>
  update?(query: any): Promise<any[]>
  delete?(query: any): Promise<any[]>
}
