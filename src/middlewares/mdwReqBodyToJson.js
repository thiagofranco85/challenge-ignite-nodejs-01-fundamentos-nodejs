export async function mdwReqBodyToJson(req, res) {
    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    const fullStreamContent = Buffer.concat(buffers).toString()

    req.body = fullStreamContent ? JSON.parse(fullStreamContent) : null

    res.setHeader('Content-type', 'application/json')
}