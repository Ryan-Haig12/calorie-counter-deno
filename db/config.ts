import Dexecutor from "https://deno.land/x/dexecutor/mod.ts"
import keys from './keys.ts'

const client = "postgres"

console.log(keys)

// Creating the query executor
let db = new Dexecutor({
    client: client,
    connection: {
        host: keys.HOST,
        user: keys.USER,
        password: keys.PASSWORD,
        port: 5432,
        database: keys.USER,
    }
})
export default db
