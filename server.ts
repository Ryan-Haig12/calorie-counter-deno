import { Application } from 'https://deno.land/x/oak/mod.ts'

import db from './db/config.ts'
import router from './routes.ts'
import querySanitizer from './utils/querySanitizer.ts'

const app = new Application()
await db.connect()

app.use(querySanitizer)
app.use(router.routes())
app.use(router.allowedMethods())

const port = 4000
console.log(`🦕 Deno 🦕 Server running on port 🦖 ${ port } 🦖`)
await app.listen({ port })