export interface IntegrationBase {
  create?(query: any): Promise<any[] | any>
  read?(query: any): Promise<any[] | any>
  update?(query: any): Promise<any[] | any>
  delete?(query: any): Promise<any[] | any>
}
