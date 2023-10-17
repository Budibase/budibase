declare module "dynalite" {
  import { Server } from "http";

  interface DynaliteOptions {
    ssl?: boolean;
    path?: string;
    createTableMs?: number;
    deleteTableMs?: number;
    updateTableMs?: number;
    maxItemSizeKb?: number;
  }

  export interface DynaliteServer extends Omit<Server, "close"> {
    close(cb?: (err?: Error) => void): void;
  }

  export class DynaliteServer {
    public close(cb?: (err?: Error) => void): void;
  }

  function createDynalite(options: DynaliteOptions): DynaliteServer;

  export default createDynalite;
}
