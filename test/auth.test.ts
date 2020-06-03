import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'
import { validUUID, validEmail } from '../utils/regex.ts'

const url = `http://localhost:4000/api/v1/auth`
const route = `POST /api/v1/auth`

Deno.test(`${ route } should return an error when no data provided`, async () => {
    let res = await fetch(url, {
        method: 'POST',
		headers: { 'content-type': 'application/json' }
    })
    const data = await res.json()
    assertEquals(data.error, 'email and password required')
})

Deno.test(`${ route } should return an error when no email is sent`, async () => {
    let res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ "password": "password" }),
		headers: { 'content-type': 'application/json' }
    })
    const data = await res.json()
    assertEquals(data.error, 'email and password required')
})

Deno.test(`${ route } should return an error when no password is sent`, async () => {
    let res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ "email": "haigryangmail.com" }),
		headers: { 'content-type': 'application/json' }
    })
    const data = await res.json()
    assertEquals(data.error, 'email and password required')
})

Deno.test(`${ route } should return an error when email is invalid`, async () => {
    let res
    res = await fetch(url, {
        method: 'POST',
		body: JSON.stringify({ "password": "password", "email": "haigryangmail.com" }),
		headers: { 'content-type': 'application/json' }
    })
    res = await res.json()
    assertEquals(res.error, 'Email haigryangmail.com is invalid')

    res = await fetch(url, {
        method: 'POST',
		body: JSON.stringify({ "password": "password", "email": "haigryan@gmailcom" }),
		headers: { 'content-type': 'application/json' }
    })
    res = await res.json()
    assertEquals(res.error, 'Email haigryan@gmailcom is invalid')

    res = await fetch(url, {
        method: 'POST',
		body: JSON.stringify({ "password": "password", "email": "haigryangmailcom" }),
		headers: { 'content-type': 'application/json' }
    })
    res = await res.json()
    assertEquals(res.error, 'Email haigryangmailcom is invalid')
})

Deno.test(`${ route } should return an error when email is not found in db`, async () => {
    let res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ "password": "password", "email": "youWontFindMe@haig.com" }),
		headers: { 'content-type': 'application/json' }
    })
    const data = await res.json()
    assertEquals(data.error, 'Email youWontFindMe@haig.com not found')
})

Deno.test(`${ route } should return an error when email and password do not match`, async () => {
    let res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ "password": "notMyPassword", "email": "haigryan@gmail.com" }),
		headers: { 'content-type': 'application/json' }
    })
    const data = await res.json()

    assertEquals(data.error, 'Email/password are not correct')
})

Deno.test(`${ route } should successfully auth user`, async () => {
    let res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ "password": "password", "email": "haigryan@gmail.com" }),
		headers: { 'content-type': 'application/json' }
    })
    const data = await res.json()

    assertEquals(validUUID.test(data.id), true)
    assertEquals(data.username, 'HaigRyan')
    assertEquals(data.password, undefined)
    assertEquals(data.email, 'haigryan@gmail.com')
    assertEquals(validEmail.test(data.email), true)
    assertEquals(data.created_on > '2020-01-01', true)
    assertEquals(validUUID.test(data.authtoken), true)
})