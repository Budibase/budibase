// Mimic the outer package export for usage in index.ts
// The outer exports can't be used as they now reference dist directly
import Client from "../redis"
import utils from "../redis/utils"
import clients from "../redis/init"

export = {
  Client,
  utils,
  clients,
}
