# Calorie Counter Deno
This is a simple api using a deno backend and PostgreSQL database

Deno is a brand new TypeScript runtime environment that I have been eager to play around with. I am very comfortable with Node.js, so a lot of the features and practices have been easy to learn and enjoyable to code with.

# Running
You will not be able to run this out of the box. In order to run this app you'll need to complete 2 steps

## Step 1
Create your own PostgreSQL database, I used `https://www.elephantsql.com/`. Create a file in the root directory called `db` and add a single file to it called `config.ts`

```Typescript
import Dexecutor from "https://deno.land/x/dexecutor/mod.ts"

const client = "postgres"

// Creating the query executor
let db = new Dexecutor({
    client: client,
    connection: {
        host: HOSTNAME,
        user: USERNAME,
        password: PASSWORD,
        port: 5432,
        database: DATABASENAME,
    }
})

export default db
```

## Step 2
To run this from your terminal, enter the root directory and run `denon run --allow-net --unstable server.ts`
You will need to install `denon` to accomplish this, 
`deno install --allow-read --allow-run --allow-write -f --unstable https://deno.land/x/denon/denon.ts`

The `scripts.yaml` file I have created in the root directory is used for an script launcher similar to npm's, 
`https://deno.land/x/velociraptor/`
`deno install --allow-read --allow-write --allow-env --allow-run -n vr https://deno.land/x/velociraptor/cli.ts`
and then to run locally...
`vr server`