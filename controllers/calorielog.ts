import db from '../db/config.ts'
import queryResParser from '../utils/queryResParser.ts'
import { validDate } from '../utils/regex.ts'

// @desc Create a new calorie log
// @route POST /api/v1/calorie/createLog
const createCalorieLog = async ({ response, request }: { response: any, request: any }) => {
    const data = await request.body()

    // if no body or not every variable provided, return error
    if(!data.value || !data.value.userId || !data.value.food || !data.value.calories) {
        response.status = 400
        response.body = {
            error: 'userId, food, and calories required'
        }
        return
    }

    // if user does not exist, throw an error
    let user = await db.execute(`select * from users where id = '${ data.value.userId }'`)
    user = queryResParser({ data: user })
    if(!user.length) {
        response.status = 404
        response.body = {
            error: `User ${ data.value.userId } not found`
        }
        return
    }

    user = user[0] // treat user as an object not an array of objects

    // log calorieLog
    await db.execute(`insert into calorieLog (userId, food, calories) values ('${ data.value.userId }', '${ data.value.food }', ${ data.value.calories })`)

    // if the new calorieLog is not returned, throw an error
    let newLog = await db.execute(`select * from calorielog where userId = '${ data.value.userId }' and food = '${ data.value.food }' and calories = ${ data.value.calories }`)
    newLog = queryResParser({ data: newLog })
    if(!newLog.length) {
        response.status = 500
        response.body = {
            error: `Failed to create calorieLog, I hope you never see this error message...`
        }
        return
    }

    response.status = 200
    response.body = newLog[0]
}

// @desc Get all calorieLogs from database for a single user
// @route GET /api/v1/calorie/user/:userId
const getCalorieLog = async ({ response, params }: { response: any, params: { userId: string } }) => {
    let log = await db.execute(`select * from calorielog where userid = '${ params.userId }' `)
    log = queryResParser({ data: log })

    // if there's no log, return an error
    if(!log.length) {
        response.status = 404
        response.body = {
            error: `No Calorie Logs found for UserId ${ params.userId }`
        }
        return
    }

    response.body = log
}

// @desc Get a single calorieLog by logId
// @route GET /api/v1/calorie/log/:logId
const getCalorieLogById = async ({ response, request, params }: { response: any, request: any, params: { logId: string } }) => {
    let log = await db.execute(`select * from calorielog where logId = '${ params.logId }' `)
    log = queryResParser({ data: log })

    // if there's no log, return an error
    if(!log.length) {
        response.status = 404
        response.body = {
            error: `No Calorie Logs found for LogId ${ params.logId }`
        }
        return
    }

    response.body = log[0]
}

// @desc Update a calorieLog by logId
// @route PUT /api/v1/calorie/update/:logId
const updateCalorieLog = async ({ response, params, request }: { response: any, params: { logId: string }, request: any }) => {
    let log = await db.execute(`select * from calorielog where logid = '${ params.logId }' `)
    log = queryResParser({ data: log })

    // if log is not found, return error
    if(!log.length) {
        response.status = 404
        response.body = {
            error: `Calorie Log ${ params.logId } not found`
        }
        return
    }

    // if no body or not every variable provided, return error
    const data = await request.body()
    if(!data.value || (!data.value.food && !data.value.calories)) {
        response.status = 400
        response.body = {
            error: 'food and/or calories required'
        }
        return
    }
    
    // update the log
    let queryBody = ''
    if(data.value.food) queryBody += `food = '${ data.value.food }'`
    if(data.value.calories) {
        if(data.value.food) queryBody += `, `
        queryBody += `calories = ${ data.value.calories }`
    }
    let query = `update calorielog set ${ queryBody } where logId = '${ params.logId }'`
    await db.execute(query)

    // if the calorielog was not updated, return an error
    let updatedLog = await db.execute(`select * from calorielog where logId = '${ params.logId }'`)
    updatedLog = queryResParser({ data: updatedLog })

    if(!updatedLog.length) {
        response.status = 500
        response.body = {
            error: 'error updating calorie log... I hope you never see this error message'
        }
        return
    }

    response.status = 200
    response.body = updatedLog[0]
}

// @desc Delete a calorieLog by logId
// @route /api/v1/calorie/delete/:logId
const deleteCalorieLog = async ({ response, params }: { response: any, params: { logId: string } }) => {
    let log = await db.execute(`select * from calorielog where logid = '${ params.logId }' `)
    log = queryResParser({ data: log })

    // if user is not found, return error
    if(!log.length) {
        response.status = 404
        response.body = {
            error: `Calorie Log ${ params.logId } not found`
        }
        return
    }

    // delete the log
    await db.execute(`delete from calorielog where logId = '${ params.logId }'`)

    response.status = 204
}

// @desc Get all calorieLogs in a specific timeframe.
// @route POST /api/v1/calorie/daterange/:begin/:end
const getAllByTime = async ({ response, request, params }: { response: any, request: any, params: { begin: string, end: string } }) => {
    if(!validDate.test(params.begin)) {
        response.status = 400
        response.body = { error: `${ params.begin } is not a valid date` }
        return
    }

    if(!validDate.test(params.end)) {
        response.status = 400
        response.body = { error: `${ params.end } is not a valid date` }
        return
    }

    // get all logs in the allocated time
    let logs = await db.execute(`select * from calorieLog where logged_at < '${ params.end }' and logged_at > '${ params.begin }'`)
    logs = queryResParser({ data: logs })

    response.status = 200
    response.body = {
        records: logs.length,
        data: logs
    }
}

// @desc Get all calorieLogs by food
// @route GET /api/v1/calorie/food/:foodName
const getByFoodName = async ({ response, params }: { response: any, params: { foodName: string } }) => {
    let logs = await db.execute(`select * from calorielog where food ilike '%${ params.foodName.toLowerCase() }%' `)
    logs = queryResParser({ data: logs })

    // if there's no log, return an error
    if(!logs.length) {
        response.status = 404
        response.body = {
            error: `No Calorie Logs found for food ${ params.foodName }`
        }
        return
    }

    response.body = logs
}

// @desc Get all calorieLogs that fall in the given calorie range
// @route GET /api/v1/calorie/calorierange/:begin/:end
const getLogsInCalorieRange = async ({ response, params }: { response: any, params: { begin: string, end: string } }) => {
    // get all logs in the allocated time
    let logs = await db.execute(`select * from calorieLog where calories <= ${ params.end } and calories >= ${ params.begin }`)
    logs = queryResParser({ data: logs })

    response.status = 200
    response.body = {
        records: logs.length,
        data: logs
    }
}

export { createCalorieLog, getCalorieLog, getCalorieLogById, updateCalorieLog, deleteCalorieLog, getAllByTime, getByFoodName, getLogsInCalorieRange }