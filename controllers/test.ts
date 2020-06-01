import db from '../db/config.ts'
import queryResParser from '../utils/queryResParser.ts'

// @desc Test
// @route GET /api/v1/test
const test = async ({ response }: { response: any }) => {

    const data = await db.execute("select * from users where username = 'Haig'")
    const d = queryResParser({ data })

    response.body = d
}

export { test }