
import { IConfig } from "./types"
import { load } from "./webc"

export const DEFAULT_KEY = "*";

export const WEBC_KEY = "webc";

export const WEBC_LOADER = {
  postfix: ".webc.js",
  loader: load
}

export const DEFAULT_CONFIG: IConfig = {
  scanImportmap: true,
  loaders: {
    WEBC_KEY: WEBC_LOADER,
    DEFAULT_KEY: WEBC_KEY
  },
  observable: true
}
