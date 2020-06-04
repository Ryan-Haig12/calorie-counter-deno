import * as flags from 'https://deno.land/std/flags/mod.ts'
import * as devKeys from './dev.ts'
import * as herokuKeys from './heroku.ts'

// get env port
const { args } = Deno
const argPort = flags.parse(args).port
const DEFAULT_PORT = 4000
const port = argPort ? Number(argPort) : DEFAULT_PORT

const keys = port === DEFAULT_PORT ? devKeys : herokuKeys

export default keys