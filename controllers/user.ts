import db from '../db/config.ts'
import queryResParser from '../utils/queryResParser.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts'

// @desc Get user from db by userId
// @route GET /api/v1/users/:id
const getUserById = async ({ response, params }: { response: any, params: { id: string } }) => {
    const data = await db.execute(`select * from users where id = '${ params.id }' `)
    const d = queryResParser({ data })

    response.body = d
}

// @desc Get user from db by ussername
// @route GET /api/v1/users/:username
const getUserByName = async ({ response, params }: { response: any, params: { username: string } }) => {
    const data = await db.execute(`select * from users where username = '${ params.username }' `)
    const d = queryResParser({ data })

    if(!d.length) response.body = { error: `User ${ params.username } Not Found` }

    response.body = d[0]
}

// @desc Get all user from db by userId, calorie and exercise logs included
// @route GET /api/v1/users/allData/:id
const getAllUserDataById = async ({ response, params }: { response: any, params: { id: string } }) => {
    const data = await db.execute(`select * from users where id = '${ params.id }' `)
    const d = queryResParser({ data })
    const caloryData = await db.execute(`select * from calorieLog where userid = '${ params.id }' `)
    const cd = queryResParser({ data: caloryData })
    const exerciseData = await db.execute(`select * from exerciseLog where userid = '${ params.id }' `)
    const ed = queryResParser({ data: exerciseData })

    response.body = {
        user: d[0], // there's no need to return user data as an array
        calories: cd,
        exercise: ed
    }
}

// @desc Create a new User 
// @route POST /api/v1/users/create
const createUser = async ({ request, response }: { request: any, response: any }) => {
    const data = await request.body()

    // if no body or not every variable provided, return error
    if(!data.value || !data.value.username || !data.value.email || !data.value.password || !data.value.password2) {
        response.status = 400
        response.body = {
            error: 'username, email, password, and password2 required'
        }
        return
    }

    // if the email is not a valid email, return an error
    const re: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmail = re.test(data.value.email)
    if(!isEmail) {
        response.status = 400
        response.body = { error: `Email ${ data.value.email } is invalid` }
        return
    }

    // if username or email exist, return an error
    let userExists = await db.execute(`select * from users where email = '${ data.value.email }' or username = '${ data.value.username }'`)
    userExists = queryResParser({ data: userExists })
    if(userExists.length) {
        response.status = 400
        response.body = {
            error: 'username or email has already been registered'
        }
        return
    }

    // if passwords do not match, return an error
    if(data.value.password != data.value.password2) {
        response.status = 400
        response.body = {
            error: 'passwords must match'
        }
        return
    }

    // hash password for db storage
    const salt = await bcrypt.genSalt(8)
    const hash = await bcrypt.hash(data.value.password, salt)

    // create user and return new user info
    await db.execute(`insert into users (username, password, email) values ('${ data.value.username }', '${ hash }', '${ data.value.email }')`)
    let newUser = await db.execute(`select * from users where email = '${ data.value.email }'`)
    newUser = queryResParser({ data: newUser })

    // if the new user was not created, return an error
    if(!newUser.length) {
        response.status = 500
        response.body = {
            error: 'error creating new user... I hope you never see this error message'
        }
        return
    }

    response.status = 200
    response.body = newUser[0] // there's no need to return user data as an array
}

// @desc Update a User by id 
// @route PUT /api/v1/users/update:id
const updateUser = async ({ request, response, params }: { request: any, response: any, params: { id: string } }) => {
    let user = await db.execute(`select * from users where id = '${ params.id }' `)
    user = queryResParser({ data: user })

    // if user is not found, return error
    if(!user.length) {
        response.status = 404
        response.body = {
            error: `user ${ params.id } not found`
        }
        return
    }

    // if no body or not every variable provided, return error
    const data = await request.body()
    if(!data.value || (!data.value.username && !data.value.email && !data.value.password)) {
        response.status = 400
        response.body = {
            error: 'username, email, or password required'
        }
        return
    }

    // if username or email exist, return an error
    let userExists = await db.execute(`select * from users where email = '${ data.value.email }' or username = '${ data.value.username }'`)
    userExists = queryResParser({ data: userExists })
    if(userExists.length) {
        response.status = 400
        response.body = {
            error: 'username or email has already been registered'
        }
        return
    }

    // append all arguments into a query body
    let queryBody = ''
    if(data.value.username) queryBody += `username = '${ data.value.username }'`
    if(data.value.password) {
        if(data.value.username) queryBody += ', '
        // hash password for db storage
        const salt = await bcrypt.genSalt(8)
        const hash = await bcrypt.hash(data.value.password, salt)
        queryBody += `password = '${ hash }'`
    }
    if(data.value.email) {
        if(data.value.username || data.value.password) queryBody += ', '
        queryBody += `email = '${ data.value.email }'`
    }
    let query = `update users set ${ queryBody } where id = '${ params.id }'`

    // update the user
    await db.execute(query)

    // if the new user was not created, return an error
    let newUser = await db.execute(`select * from users where id = '${ params.id }'`)
    newUser = queryResParser({ data: newUser })
    if(!newUser.length) {
        response.status = 500
        response.body = {
            error: 'error creating new user... I hope you never see this error message'
        }
        return
    }

    response.status = 200
    response.body = newUser[0] // there's no need to return user data as an array
}

// @desc Delete a User 
// @route DELETE /api/v1/users/deleteUser/:id
const deleteUser = async ({ request, response, params }: { request: any, response: any, params: { id: string } }) => {
    const data = await db.execute(`select * from users where id = '${ params.id }' `)
    let user = queryResParser({ data })

    // if user is not found, return error
    if(!user.length) {
        response.status = 404
        response.body = {
            error: `user ${ params.id } not found`
        }
        return
    }

    // ensuring that the user truly wants to delete their account will be handled client side
    // delete the user
    await db.execute(`delete from users where id = '${ params.id }'`)

    response.status = 204
}

export { getUserById, getUserByName, getAllUserDataById, createUser, updateUser, deleteUser }