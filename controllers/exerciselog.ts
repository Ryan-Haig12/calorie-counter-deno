import db from '../db/config.ts'
import queryResParser from '../utils/queryResParser.ts'

// @desc Create a new exercise log and place it in postgres
// @route POST /api/v1/exercise/createLog
const createExerciseLog = async ({ response, request }: { response: any, request: any }) => {
    const data = await request.body()

    // if no body or not every variable provided, return error
    if(!data.value || !data.value.userId || !data.value.activity || !data.value.calories_burnt) {
        response.status = 400
        response.body = {
            error: 'userId, activity, and calories_burnt required'
        }
        return
    }

    // if user does not exist, throw an error
    let user = await db.execute(`select * from users where id = '${ data.value.userId }'`)
    user = queryResParser({ data: user })
    if(!user.length) {
        response.status = 400
        response.body = {
            error: `User ${ data.value.userId } not found`
        }
        return
    }

    user = user[0] // treat user as an object not an array of objects

    // log exerciseLog
    await db.execute(`insert into exerciseLog (userId, activity, calories_burnt) values ('${ data.value.userId }', '${ data.value.activity }', ${ data.value.calories_burnt })`)

    // if exerciseLog is not returned, throw an error
    let newLog = await db.execute(`select * from exerciselog where userId = '${ data.value.userId }' and activity = '${ data.value.activity }' and calories_burnt = ${ data.value.calories_burnt }`)
    newLog = queryResParser({ data: newLog })

    if(!newLog.length) {
        response.status = 500
        response.body = {
            error: `Failed to create exerciseLog, I hope you never see this error message...`
        }
        return
    }

    response.status = 200
    response.body = newLog[0]
}

// @desc Create a new exercise log and place it in postgres
// @route GET /api/v1/exercise/:userId
const getExerciseLog = async ({ response, params }: { response: any, params: any }) => {
    let log = await db.execute(`select * from exerciselog where userid = '${ params.userId }' `)
    log = queryResParser({ data: log })

    // if there's no log, return an error
    if(!log.length) {
        response.status = 404
        response.body = {
            error: `No Logs found for UserId ${ params.userId }`
        }
        return
    }

    response.body = log
}

// @desc Update an exercise log
// @route PUT /api/v1/exercise/update/:logId
const updateExerciseLog = async ({ response, request, params }: { response: any, request: any, params: any }) => {
    let log = await db.execute(`select * from exerciselog where logid = '${ params.logId }' `)
    log = queryResParser({ data: log })

    console.log(log)

    // if log is not found, return error
    if(!log.length) {
        response.status = 404
        response.body = {
            error: `Exercise Log ${ params.logId } not found`
        }
        return
    }

    // if no body or not every variable provided, return error
    const data = await request.body()
    if(!data.value || (!data.value.activity && !data.value.calories_burnt)) {
        response.status = 400
        response.body = {
            error: 'activity and/or calories_burnt required'
        }
        return
    }

    // update the log
    let queryBody = ''
    if(data.value.activity) queryBody += `activity = '${ data.value.activity }'`
    if(data.value.calories_burnt) {
        if(data.value.activity) queryBody += `, `
        queryBody += `calories_burnt = ${ data.value.calories_burnt }`
    }
    let query = `update exerciselog set ${ queryBody } where logId = '${ params.logId }'`
    await db.execute(query)

    // if the exerciselog was not updated, return an error
    let updatedLog = await db.execute(`select * from exerciselog where logId = '${ params.logId }'`)
    updatedLog = queryResParser({ data: updatedLog })

    if(!updatedLog.length) {
        response.status = 500
        response.body = {
            error: 'error creating new user... I hope you never see this error message'
        }
        return
    }

    response.body = updatedLog[0]
}

// @desc Delete an exercise log
// @route DELETE /api/v1/exercise/delete/:logId
const deleteExerciseLog = async ({ response, params }: { response: any, params: any }) => {
    let log = await db.execute(`select * from exerciselog where logid = '${ params.logId }' `)
    log = queryResParser({ data: log })

    // if user is not found, return error
    if(!log.length) {
        response.status = 404
        response.body = {
            error: `Log ${ params.logId } not found`
        }
        return
    }

    // ensuring that the user truly wants to delete their account will be handled client side
    // delete the user
    await db.execute(`delete from exerciselog where logId = '${ params.logId }'`)

    response.status = 204
}

export { createExerciseLog, getExerciseLog, updateExerciseLog, deleteExerciseLog }