const HOST = Deno.env.toObject().HOST
const USER = Deno.env.toObject().USER
const PASSWORD = Deno.env.toObject().PASSWORD

console.log('module', Deno.env.toObject())
console.log('host', Deno.env.toObject().HOST)
console.log('user', Deno.env.toObject().USER)
console.log('password', Deno.env.toObject().PASSWORD)

export { HOST, USER, PASSWORD }