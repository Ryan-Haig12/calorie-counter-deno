import { Application } from 'https://deno.land/x/oak/mod.ts'
import * as flags from 'https://deno.land/std/flags/mod.ts'

import db from './db/config.ts'
import router from './routes.ts'
import querySanitizer from './utils/querySanitizer.ts'

// get env port
const { args } = Deno
const argPort = flags.parse(args).port
const DEFAULT_PORT = 4000
const port = argPort ? Number(argPort) : DEFAULT_PORT

const app = new Application()
await db.connect() // <- this is the error

app.use(querySanitizer)
app.use(router.routes())
app.use(router.allowedMethods())

console.log(`🦕 Deno 🦕 Server running on port 🦖 ${ port } 🦖`)
await app.listen({ port })