const querySanitizer = async ({ request, response }: { request: any, response: any }, next: any) => {
    const data = await request.body()

    // ensure that the request body is only alphanumberical, spaces, underscore, or a single dash
    const alphanumberical: RegExp = /^[a-zA-Z0-9_ -]*$/
    const twoDashesInRow: RegExp = /^(-\1{2})/ // i wish i understood regex better enough to combine these 2 expressions...
    let flag = true
    let error = ''
    for(let i in data.value) {
        // if the key/value pair is alphanumberical and a dash (-) does not appear twice in a row
        // alphanumberical is to ensure *, ^, =, ", etc do not appear in the value
        // twoDashesInRow  is to ensure dashes dashes do not appear twice in a row, preventing the rest of the query from being commented out
        if(!(alphanumberical.test(data.value[i]) && !twoDashesInRow.test(data.value[i]))) {
            error = `"${ data.value[i] }" is unnaceptable`
            flag = false
        }
    }

    if(flag) {
        await next()
    } else {
        response.status = 400
        response.body = {
            error
        }
    }
}

export default querySanitizer