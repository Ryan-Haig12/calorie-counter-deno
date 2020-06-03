import db from '../db/config.ts'
import queryResParser from '../utils/queryResParser.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts'

// @desc Login User
// @route POST /api/v1/auth
const login = async ({ response, request }: { response: any, request: any }) => {
    // if no body or not every variable provided, return error
    const data = await request.body()
    if(!data.value || !data.value.email || !data.value.password) {
        response.status = 400
        response.body = {
            error: 'email and password required'
        }
        return
    }

    // if the email is not a valid email, return an error
    const validEmail: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmail = validEmail.test(data.value.email)
    if(!isEmail) {
        response.status = 400
        response.body = { error: `Email ${ data.value.email } is invalid` }
        return
    }

    // get user from db
    let user = await db.execute(`select * from users where email = '${ data.value.email }' `)
    user = queryResParser({ data: user })

    // if there's no user, return an error
    if(!user.length) {
        response.status = 404
        response.body = { error: `Email ${ data.value.email } not found` }
        return
    }

    // make user an object rather than an array of 1 object
    user = user[0]

    // if passwords do not match, return an error
    const passMatch = await bcrypt.compare(data.value.password, user.password)
    if(!passMatch) {
        response.status = 400
        response.body = { error: `Email/password are not correct` }
        return
    }

    // don't return the password
    user.password = undefined

    response.status = 200
    response.body = user
}

export { login }