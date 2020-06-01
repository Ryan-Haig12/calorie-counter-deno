// the response body from dexecuter is not my favorite
// in this file i alter the response by merging the 2 objects they return into a JSON object
const queryResParser = ({ data }: { data: any }) => {
    const columns = data.rowDescription.columns.map( (col:any) => col.name)
    const rows = data.rows

    let res:any[] = []
    let obj: { [index: string]:any } = {}
   
    for(let row in rows) {
        for(let col in columns) {
            obj[columns[col]] = rows[row][col]
        }
        res.push(obj)
        obj = {}
    }

    return res
}

export default queryResParser