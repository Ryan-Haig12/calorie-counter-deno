import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'

const url = `http://localhost:4000`

Deno.test(`GET /api/v1/users/id/:userId should throw error with invalid uuid`, async () => {
    let res = await fetch(url + '/api/v1/users/id/123456', {
        method: 'GET',
		headers: { 'content-type': 'application/json' }
    })
    const data = await res.json()
    assertEquals(data.error, 'userId 123456 is not a valid UUID')
})

Deno.test(`GET /api/v1/users/id/:userId should throw error with uuid not in database`, async () => {
    let res = await fetch(url + '/api/v1/users/id/12619c93-20b2-41d9-a8da-b96728710aad', {
        method: 'GET',
		headers: { 'content-type': 'application/json' }
    })
    const data = await res.json()
    assertEquals(data.error, 'userId 12619c93-20b2-41d9-a8da-b96728710aad was not found')
})

Deno.test(`GET /api/v1/users/id/:userId should return the proper user`, async () => {
    let res = await fetch(url + '/api/v1/users/id/84612c93-20b2-41d9-a8da-b96728710aad', {
        method: 'GET',
		headers: { 'content-type': 'application/json' }
    })
    const data = await res.json()
    assertEquals(data.username, 'HaigRyan')
})